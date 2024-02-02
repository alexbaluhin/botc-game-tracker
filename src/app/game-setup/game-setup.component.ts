import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameSetupInfoService } from './data-access/game-setup-info.service';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterOutlet],
  providers: [GameSetupInfoService],
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupComponent {}
