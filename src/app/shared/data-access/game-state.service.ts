import { effect, Injectable, signal } from '@angular/core';
import {
  enrichCharacterInfo,
  getCharacterById,
  getCharactersFromBaseScript,
} from '../../characters/utils/characters';
import { Script, scriptName } from '../../constants';
import { Character, Player } from '../../typings';

interface GameInformation {
  name?: string;
  script?: Script;
  characters: Character[];
  players: Player[];
  gossip?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
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
      players: new Array(count).fill({}),
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

  resetGameState() {
    this.clearLocalStorage();
    this.info.set(this.loadFromLocalStorage());
  }

  createShareLink() {
    return `${window.location.origin}?share=${btoa(this.mapGameStateToShareString())}`;
  }

  getGameStateFromShareLink(linkInBase64: string) {
    return this.mapShareStringToGameState(atob(linkInBase64));
  }

  private mapGameStateToShareString() {
    const players = this.info()
      .players.map(({ name, character }) =>
        name ? `${name}${character?.id ? `:${character.id}` : ''}` : ''
      )
      .join(',');
    const characters = this.info()
      .characters.map(({ id }) => id)
      .join(',');
    return `${this.info().script};${this.info().name};${characters};${players}`;
  }

  private mapShareStringToGameState(shareString: string) {
    const [script, name, charactersString, playersString] =
      shareString.split(';');
    const characters = enrichCharacterInfo(
      charactersString.split(',').map(character => ({ id: character }))
    );
    const players = playersString.split(',').map(player => {
      let name = player || undefined;
      let character: Character | string | undefined = undefined;
      if (player.includes(':')) {
        [name, character] = player.split(':');
        character = getCharacterById(character);
      }
      return { name, character };
    });

    return { name, script: script as Script, players, characters };
  }

  private clearLocalStorage() {
    window.localStorage.removeItem('game-setup');
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
