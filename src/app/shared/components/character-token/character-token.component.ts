import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Character } from '../../../typings';

@Component({
  selector: 'app-character-token',
  imports: [NgOptimizedImage],
  templateUrl: './character-token.component.html',
  styleUrls: ['./character-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterTokenComponent {
  characters = input.required<Character[]>();
  withShroud = input<boolean>(false);
  active = input<boolean>();
  selectable = input<boolean>();
}
