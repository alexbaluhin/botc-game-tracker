import { inject, Injectable } from '@angular/core';
import {
  enrichCharacterInfo,
  getCharacterById,
} from '../../characters/utils/characters';
import { Script } from '../../constants';
import { GameInformation, Player } from '../../typings';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class GameShareService {
  gameStateService = inject(GameStateService);

  createShareLink() {
    return `${window.location.origin}?share=${btoa(this.mapGameStateToShareString())}`;
  }

  getGameStateFromShareLink(linkInBase64: string) {
    return this.mapShareStringToGameState(atob(linkInBase64));
  }

  private mapGameStateToShareString() {
    const players = this.gameStateService
      .info()
      .players.map(({ name, characters }) => {
        const nameString = name ? encodeURI(name) : '';
        const charactersString = characters.length
          ? characters.map(character => character.id).join(':')
          : '';
        return `${nameString}:${charactersString}`;
      })
      .join(',');
    const characters = this.gameStateService
      .info()
      .characters.map(({ id }) => id)
      .join(',');
    return `${this.gameStateService.info().script};${this.gameStateService.info().name};${characters};${players}`;
  }

  private mapShareStringToGameState(shareString: string): GameInformation {
    const [script, name, charactersString, playersString] =
      shareString.split(';');
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
      script: script as Script,
      players,
      characters,
      gossips: [],
      version: this.gameStateService.version,
      states: {
        playersPositionsWereCalculated: false,
      },
    };
  }
}
