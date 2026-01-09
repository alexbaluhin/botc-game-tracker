import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Character } from '../../../typings';

@Component({
  selector: 'app-character-card',
  imports: [CardComponent],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCardComponent {
  character = input.required<Character>();
}
