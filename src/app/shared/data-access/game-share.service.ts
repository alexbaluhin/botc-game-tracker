import { inject, Injectable } from '@angular/core';
import {
  enrichCharacterInfo,
  getCharacterById,
} from '../../core-data/utils/characters';
import { Player } from '../../typings';
import { GameState, GameStore, version } from './game-state-store';

@Injectable({
  providedIn: 'root',
})
export class GameShareService {
  gameStore = inject(GameStore);

  createShareLink() {
    return `${window.location.origin}?share=${btoa(this.mapGameStateToShareString())}`;
  }

  getGameStateFromShareLink(linkInBase64: string) {
    return this.mapShareStringToGameState(atob(linkInBase64));
  }

  private mapGameStateToShareString() {
    const players = this.gameStore
      .players()
      .map(({ name, characters }) => {
        const nameString = name ? encodeURI(name) : '';
        const charactersString = characters.length
          ? characters.map(character => character.id).join(':')
          : '';
        return `${nameString}:${charactersString}`;
      })
      .join(',');
    const characters = this.gameStore
      .characters()
      .map(({ id }) => id)
      .join(',');
    return `${this.gameStore.name()};${characters};${players}`;
  }

  private mapShareStringToGameState(shareString: string): GameState {
    const [name, charactersString, playersString] = shareString.split(';');
    const characters = enrichCharacterInfo(
      charactersString.split(',').map(character => ({ id: character }))
    );
    const players = playersString.split(',').map(player => {
      const [name, ...charactersIds] = player.split(':');
      const characters = charactersIds
        .map(id => getCharacterById(id))
        .filter(id => id !== undefined);
      return {
        name: decodeURI(name),
        characters,
        positionInGrimoire: { x: 0, y: 0 },
      } as Player;
    });

    return {
      name,
      players,
      characters,
      reminders: [],
      gossips: [],
      bluffs: new Array(3).fill(null),
      version: version,
      states: {
        playersPositionsWereCalculated: false,
      },
    };
  }
}
