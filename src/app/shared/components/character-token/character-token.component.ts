import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Character } from '../../../typings';

interface CharacterForToken extends Character {
  iconUrl: string;
}

@Component({
  selector: 'app-character-token',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './character-token.component.html',
  styleUrls: ['./character-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterTokenComponent {
  characterForToken: CharacterForToken | null = null;

  @Input() set character(value: Character | null) {
    if (!value) {
      this.characterForToken = null;
      return;
    }

    this.characterForToken = {
      ...value,
      iconUrl: `/assets/characters-icons/${value.id}.png`,
    };
  }
}
