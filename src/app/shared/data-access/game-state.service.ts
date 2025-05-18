import { Injectable, signal } from '@angular/core';
import {
  enrichCharacterInfo,
  getCharactersFromBaseScript,
} from '../../characters/utils/characters';
import { Script, scriptName } from '../../constants';
import { Character, Player } from '../../typings';

interface GameInformation {
  name?: string;
  script?: Script;
  characters: Character[];
  players: Player[];
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  public info = signal<GameInformation>(this.loadFromLocalStorage());

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
      this.saveToLocalStorage();
      return;
    }

    this.info.update(info => ({
      ...info,
      script,
      name: scriptName[script],
      characters: getCharactersFromBaseScript(script),
    }));
    this.saveToLocalStorage();
  }

  setPlayersCount(count: number) {
    this.info.update(info => ({
      ...info,
      players: new Array(count).fill({}),
    }));
    this.saveToLocalStorage();
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
    this.saveToLocalStorage();
  }

  resetGameState() {
    window.localStorage.removeItem('game-setup');
    this.info.set(this.loadFromLocalStorage());
  }

  private loadFromLocalStorage(): GameInformation {
    try {
      const gameSetupState = window.localStorage.getItem('game-setup');
      if (!gameSetupState) {
        return {
          players: [],
          characters: [],
        };
      }
      return JSON.parse(gameSetupState);
    } catch {
      return {
        players: [],
        characters: [],
      };
    }
  }

  private saveToLocalStorage() {
    window.localStorage.setItem('game-setup', JSON.stringify(this.info()));
  }
}
