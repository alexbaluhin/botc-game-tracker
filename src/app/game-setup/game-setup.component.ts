import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateService } from '../shared/data-access/game-state.service';

@Component({
  selector: 'app-game-setup',
  imports: [RouterOutlet],
  providers: [GameStateService],
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupComponent {}
