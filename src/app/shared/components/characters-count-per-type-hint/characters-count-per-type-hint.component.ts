import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Player } from '../../../typings';
import {
  charactersCountBasedOnPlayersCount,
  CharacterType,
  maxNumberOfPlayersInBaseSetup,
} from '../../../constants';

@Component({
  selector: 'app-characters-count-per-type-hint',
  imports: [NgOptimizedImage],
  templateUrl: './characters-count-per-type-hint.component.html',
  styleUrl: './characters-count-per-type-hint.component.scss',
})
export class CharactersCountPerTypeHintComponent {
  players = input.required<Player[]>();
  charactersCounts = computed(() => {
    const travellersCount = this.players().filter(
      player =>
        player.characters.length === 1 &&
        player.characters[0].type === CharacterType.TRAVELLER
    ).length;
    const playersCountMinusTravellers = this.players().length - travellersCount;
    const basePlayersCount = Math.min(
      playersCountMinusTravellers,
      maxNumberOfPlayersInBaseSetup
    );
    return {
      ...charactersCountBasedOnPlayersCount[basePlayersCount],
      [CharacterType.TRAVELLER]:
        travellersCount +
        Math.max(0, playersCountMinusTravellers - basePlayersCount),
    };
  });
  characterTypes = CharacterType;
}
