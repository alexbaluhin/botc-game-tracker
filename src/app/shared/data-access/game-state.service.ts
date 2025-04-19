import { Injectable } from '@angular/core';
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

@Injectable()
export class GameStateService {
  public info: GameInformation = this.loadFromLocalStorage();

  setScript(
    script: Script,
    name?: string,
    charactersList?: Pick<Character, 'id'>[]
  ) {
    this.info.script = script;

    if (script === Script.CUSTOM) {
      if (!charactersList) {
        console.error('Please provide characters list for custom script');
        return;
      }

      this.info.name = name;
      this.info.characters = enrichCharacterInfo(charactersList);
      this.saveToLocalStorage();
      return;
    }

    this.info.name = scriptName[script];
    this.info.characters = getCharactersFromBaseScript(script);
    this.saveToLocalStorage();
  }

  setPlayersCount(count: number) {
    this.info.players = new Array(count).fill({});
    this.saveToLocalStorage();
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
    window.localStorage.setItem('game-setup', JSON.stringify(this.info));
  }
}
