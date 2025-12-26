import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.caption]': 'true',
    '[class.active]': 'active()',
  },
})
export class ChipComponent {
  active = input<boolean>();
}
