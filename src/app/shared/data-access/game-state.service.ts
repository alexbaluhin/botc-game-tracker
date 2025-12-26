import { effect, Injectable, signal } from '@angular/core';
import {
  enrichCharacterInfo,
  getCharactersFromBaseScript,
} from '../../characters/utils/characters';
import { Script, scriptName } from '../../constants';
import { Character, GameInformation, Gossip, Player } from '../../typings';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  /* Increase the version number if old game state is incompatible with the new one */
  version = 2.1;

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

  setScript(
    script: Script,
    name?: string,
    charactersList?: Pick<Character, 'id'>[]
  ) {
    if (script === Script.CUSTOM) {
      if (!charactersList) {
        console.error('Please provide characters list for custom script');
        return;
      }

      this.info.update(info => ({
        ...info,
        script,
        name,
        characters: enrichCharacterInfo(charactersList),
      }));
      return;
    }

    this.info.update(info => ({
      ...info,
      script,
      name: scriptName[script],
      characters: getCharactersFromBaseScript(script),
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
      gossips: [],
      version: this.version,
      states: {
        playersPositionsWereCalculated: false,
      },
    };
  }
}
