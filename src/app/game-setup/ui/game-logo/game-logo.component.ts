import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-logo',
  templateUrl: './game-logo.component.html',
  styleUrl: './game-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLogoComponent {}
