import { effect, Injectable, signal } from '@angular/core';
import {
  Character,
  GameInformation,
  Gossip,
  Player,
  Reminder,
} from '../../typings';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  /* Increase the version number if old game state is incompatible with the new one */
  version = 2;

  public info = signal<GameInformation>(this.loadFromLocalStorage());

  constructor() {
    effect(() => {
      this.info();
      this.saveToLocalStorage();
    });
  }

  get gameWasSetUp(): boolean {
    const info = this.info();
    return (
      info.name !== undefined &&
      info.characters.length > 0 &&
      info.players.length > 0
    );
  }

  setScript(name: string, characters: Character[]) {
    if (!characters.length) {
      console.error('Please provide characters list for custom script');
      return;
    }

    this.info.update(info => ({
      ...info,
      name,
      characters,
    }));
  }

  setPlayersCount(count: number) {
    this.info.update(info => ({
      ...info,
      players: new Array(count).fill(this.makePlayer()),
    }));
  }

  getPlayerByIndex(index: number) {
    return this.info().players[index];
  }

  updatePlayerByIndex(updatedPlayerIndex: number, updatedPlayer: Player) {
    if (
      !this.getPlayerByIndex(updatedPlayerIndex).isCurrentViewer &&
      updatedPlayer.isCurrentViewer
    ) {
      this.info.update(info => ({
        ...info,
        players: info.players.map(player => ({
          ...player,
          isCurrentViewer: false,
        })),
      }));
    }

    this.info.update(info => ({
      ...info,
      players: info.players.map((player, i) =>
        updatedPlayerIndex === i ? updatedPlayer : player
      ),
    }));
  }

  addReminder(reminder: Reminder) {
    this.info.update(info => ({
      ...info,
      reminders: [...info.reminders, reminder],
    }));
  }

  getReminderByIndex(index: number) {
    return this.info().reminders[index];
  }

  updateReminderByIndex(
    updatedReminderIndex: number,
    updatedReminder: Reminder
  ) {
    this.info.update(info => ({
      ...info,
      reminders: info.reminders.map((reminder, i) =>
        updatedReminderIndex === i ? updatedReminder : reminder
      ),
    }));
  }

  removeReminder(reminderToRemove: Reminder) {
    this.info.update(info => ({
      ...info,
      reminders: info.reminders.filter(
        reminder =>
          `${reminder.relatedCharacter.id}${reminder.text}` !==
          `${reminderToRemove.relatedCharacter.id}${reminderToRemove.text}`
      ),
    }));
  }

  updateGossip(gossipToSave: Gossip) {
    const savedGossipIndex = this.info().gossips.findIndex(
      savedGossip =>
        savedGossip.day === gossipToSave.day &&
        savedGossip.playerName === gossipToSave.playerName
    );
    if (savedGossipIndex === -1) {
      this.info.update(info => ({
        ...info,
        gossips: [...info.gossips, gossipToSave],
      }));
    } else {
      this.info.update(info => ({
        ...info,
        gossips: info.gossips.map((savedGossip, index) =>
          index === savedGossipIndex ? gossipToSave : savedGossip
        ),
      }));
    }
  }

  resetGameState() {
    this.clearLocalStorage();
    this.info.set(this.loadFromLocalStorage());
  }

  makePlayer(): Player {
    return {
      characters: [],
      positionInGrimoire: { x: 0, y: 0 },
    };
  }

  private clearLocalStorage() {
    window.localStorage.removeItem('game-setup');
  }

  private loadFromLocalStorage(): GameInformation {
    try {
      const gameSetupState = window.localStorage.getItem('game-setup');
      if (!gameSetupState) {
        return this.getDefaultGameState();
      }
      return JSON.parse(gameSetupState);
    } catch {
      return this.getDefaultGameState();
    }
  }

  private saveToLocalStorage() {
    window.localStorage.setItem('game-setup', JSON.stringify(this.info()));
  }

  private getDefaultGameState(): GameInformation {
    return {
      players: [],
      characters: [],
      reminders: [],
      gossips: [],
      version: this.version,
      states: {
        playersPositionsWereCalculated: false,
      },
    };
  }
}
