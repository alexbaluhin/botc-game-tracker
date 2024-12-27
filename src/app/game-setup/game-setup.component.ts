import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameSetupInfoService } from './data-access/game-setup-info.service';

@Component({
  selector: 'app-game-setup',
  imports: [RouterOutlet],
  providers: [GameSetupInfoService],
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupComponent {}
