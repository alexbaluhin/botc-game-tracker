import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Player } from 'src/app/typings';
import {
  charactersCountBasedOnPlayersCount,
  CharacterType,
} from '../../../constants';

@Component({
  selector: 'app-characters-count-per-type-hint',
  imports: [NgOptimizedImage],
  templateUrl: './characters-count-per-type-hint.component.html',
  styleUrl: './characters-count-per-type-hint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersCountPerTypeHintComponent {
  players = input.required<Player[]>();
  charactersCounts = computed(
    () => charactersCountBasedOnPlayersCount[this.players().length]
  );
  characterTypes = CharacterType;
}
