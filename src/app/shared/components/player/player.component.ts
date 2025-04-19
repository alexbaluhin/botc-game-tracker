import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Player } from '../../../typings';
import { CharacterTokenComponent } from '../character-token/character-token.component';

@Component({
  selector: 'app-player',
  imports: [CharacterTokenComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  player = input.required<Player>();
}
