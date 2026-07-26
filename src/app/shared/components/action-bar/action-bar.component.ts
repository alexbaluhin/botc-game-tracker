import { Component, input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent {
  position = input<'top' | 'bottom'>('bottom');
}
