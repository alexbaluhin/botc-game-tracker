import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBarComponent {}
