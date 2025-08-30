import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Character } from '../../../typings';
import { CharacterTokenBaseComponent } from '../character-token-base/character-token-base.component';

@Component({
  selector: 'app-character-token',
  imports: [NgOptimizedImage, CharacterTokenBaseComponent],
  templateUrl: './character-token.component.html',
  styleUrls: ['./character-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterTokenComponent {
  character = input.required<Character>();
  active = input<boolean>();
  selectable = input<boolean>();
}
