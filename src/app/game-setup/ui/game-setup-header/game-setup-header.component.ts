import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-setup-header',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './game-setup-header.component.html',
  styleUrls: ['./game-setup-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSetupHeaderComponent {}
