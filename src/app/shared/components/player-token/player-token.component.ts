import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { smallestTokenSize } from '../../../constants';
import { Player } from '../../../typings';
import { AnimatedCandleComponent } from '../animated-candle/animated-candle.component';
import { CharacterTokenComponent } from '../character-token/character-token.component';

@Component({
  selector: 'app-player-token',
  imports: [CharacterTokenComponent, NgOptimizedImage, AnimatedCandleComponent],
  templateUrl: './player-token.component.html',
  styleUrl: './player-token.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--token-size]': 'tokenSizeStyle()',
  },
})
export class PlayerTokenComponent {
  player = input.required<Player>();
  size = input<number>(smallestTokenSize);
  tokenSizeStyle = computed(() => `${this.size()}px`);
}
