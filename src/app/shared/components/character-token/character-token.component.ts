import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { smallestTokenSize } from '../../../constants';
import { Character } from '../../../typings';

@Component({
  selector: 'app-character-token',
  imports: [NgOptimizedImage],
  templateUrl: './character-token.component.html',
  styleUrls: ['./character-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--token-size]': 'tokenSizeStyle()',
  },
})
export class CharacterTokenComponent {
  characters = input.required<Character[]>();
  withShroud = input<boolean>(false);
  active = input<boolean>();
  selectable = input<boolean>();
  size = input<number>(smallestTokenSize);

  tokenSizeStyle = computed(() => `${this.size()}px`);
  tokenBorderSize = 2;
  largeImageSize = computed(() => this.size() - this.tokenBorderSize * 2);
  smallImageSize = computed(() => this.largeImageSize() / 2);
}
