import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  host: {
    '[class.caption]': 'true',
    '[class.active]': 'active()',
  },
})
export class ChipComponent {
  active = input<boolean>();
}
