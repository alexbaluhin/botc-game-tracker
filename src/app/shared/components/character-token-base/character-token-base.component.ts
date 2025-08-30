import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-character-token-base',
  imports: [],
  templateUrl: './character-token-base.component.html',
  styleUrl: './character-token-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterTokenBaseComponent {
  active = input<boolean>();
  selectable = input<boolean>();
}
