import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameLogoComponent } from '../../ui/game-logo/game-logo.component';

@Component({
  selector: 'app-mode-selection',
  imports: [RouterLink, GameLogoComponent],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeSelectionComponent {}
