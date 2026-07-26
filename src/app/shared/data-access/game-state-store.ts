import { effect, inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { GrimoireService } from '../../game/data-access/grimoire.service';
import { Character, Gossip, Player, Reminder } from '../../typings';
import { positionPlayersInCircle } from '../layout/players-circle';

export const version = 3; // Increase the version number if old game state is incompatible with the new one

export type GameState = {
  name: string;
  characters: Character[];
  players: Player[];
  reminders: Reminder[];
  gossips: Gossip[];
  bluffs: (Character | null)[];
  version: number;
  states: {
    playersPositionsWereCalculated: boolean;
  };
};

export const defaultInitialState: GameState = {
  name: '',
  players: [],
  characters: [],
  reminders: [],
  gossips: [],
  bluffs: new Array(3).fill(null),
  version,
  states: {
    playersPositionsWereCalculated: false,
  },
};

const loadInitialState = (): GameState => {
  try {
    const gameSetupState = window.localStorage.getItem('game-setup');
    if (!gameSetupState) {
      return defaultInitialState;
    }
    return JSON.parse(gameSetupState);
  } catch {
    return defaultInitialState;
  }
};

const saveToLocalStorage = (state: GameState) => {
  window.localStorage.setItem('game-setup', JSON.stringify(state));
};

export const GameStore = signalStore(
  { providedIn: 'root' },
  withState(loadInitialState()),
  withProps(() => ({
    makePlayer(name?: string): Player {
      return {
        name,
        characters: [],
        positionInGrimoire: { x: 0, y: 0 },
      };
    },
  })),
  withComputed(store => ({
    gameWasSetUp: () => {
      return (
        store.name() !== undefined &&
        store.characters().length > 0 &&
        store.players().length > 0
      );
    },
    arePlayersPositionsCalculated: () =>
      store.states().playersPositionsWereCalculated,
  })),
  withHooks(store => ({
    onInit() {
      effect(() => {
        saveToLocalStorage(getState(store));
      });
    },
  })),
  withMethods((store, grimoireService = inject(GrimoireService)) => ({
    setScript(name: string, characters: Character[]) {
      if (!characters.length) {
        console.error('Please provide characters list for custom script');
        return;
      }
      patchState(store, state => ({
        ...state,
        name,
        characters,
      }));
    },
    setPlayersCount(count: number) {
      patchState(store, state => ({
        ...state,
        players: new Array(count)
          .fill(null)
          .map((_, i) => store.makePlayer(`Player ${i + 1}`)),
      }));
    },
    getPlayerByIndex(index: number) {
      return store.players()[index];
    },
    getReminderByIndex(index: number) {
      return store.reminders()[index];
    },
    addPlayer() {
      patchState(store, state => ({
        ...state,
        players: [
          ...state.players,
          store.makePlayer(`Player ${state.players.length + 1}`),
        ],
      }));
      this.calculatePlayersPositionsInCircle();
    },
    updatePlayerByIndex(updatedPlayerIndex: number, updatedPlayer: Player) {
      if (
        !store.players()[updatedPlayerIndex].isCurrentViewer &&
        updatedPlayer.isCurrentViewer
      ) {
        patchState(store, state => ({
          ...state,
          players: state.players.map(player => ({
            ...player,
            isCurrentViewer: false,
          })),
        }));
      }
      patchState(store, state => ({
        ...state,
        players: state.players.map((player, i) =>
          updatedPlayerIndex === i ? updatedPlayer : player
        ),
      }));
    },
    removePlayer(removePlayerIndex: number) {
      patchState(store, state => ({
        ...state,
        players: state.players.filter((_, i) => i !== removePlayerIndex),
      }));
      this.calculatePlayersPositionsInCircle();
    },
    addReminder(reminder: Reminder) {
      patchState(store, state => ({
        ...state,
        reminders: [...state.reminders, reminder],
      }));
    },
    updateReminderByIndex(
      updatedReminderIndex: number,
      updatedReminder: Reminder
    ) {
      patchState(store, state => ({
        ...state,
        reminders: state.reminders.map((reminder, i) =>
          updatedReminderIndex === i ? updatedReminder : reminder
        ),
      }));
    },
    removeReminder(reminderToRemove: Reminder) {
      patchState(store, state => ({
        ...state,
        reminders: state.reminders.filter(
          reminder =>
            `${reminder.relatedCharacter.id}${reminder.text}` !==
            `${reminderToRemove.relatedCharacter.id}${reminderToRemove.text}`
        ),
      }));
    },
    updateGossip(gossipToSave: Gossip) {
      const savedGossipIndex = store
        .gossips()
        .findIndex(
          savedGossip =>
            savedGossip.day === gossipToSave.day &&
            savedGossip.playerName === gossipToSave.playerName
        );
      if (savedGossipIndex === -1) {
        patchState(store, state => ({
          ...state,
          gossips: [...state.gossips, gossipToSave],
        }));
      } else {
        patchState(store, state => ({
          ...state,
          gossips: state.gossips.map((savedGossip, index) =>
            index === savedGossipIndex ? gossipToSave : savedGossip
          ),
        }));
      }
    },
    setBluff(character: Character | null, atPosition: number) {
      patchState(store, state => ({
        ...state,
        bluffs: state.bluffs.map((bluff, index) => {
          if (index === atPosition) {
            return character;
          }
          return bluff;
        }),
      }));
    },
    resetGameState() {
      window.localStorage.removeItem('game-setup');
      window.location.reload();
    },
    calculatePlayersPositionsInCircle() {
      const grimoireElement = grimoireService.getGrimoireElement();
      if (!grimoireElement) {
        return;
      }
      patchState(store, state => ({
        ...state,
        players: positionPlayersInCircle(
          state.players,
          grimoireElement.getBoundingClientRect()
        ),
        states: {
          playersPositionsWereCalculated: true,
        },
      }));
    },
    setGameStateFromSharedLink(gameStateFromLink: GameState) {
      patchState(store, () => gameStateFromLink);
    },
  }))
);
