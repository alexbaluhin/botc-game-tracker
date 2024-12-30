import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-game-logo',
  imports: [NgOptimizedImage],
  templateUrl: './game-logo.component.html',
  styleUrl: './game-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameLogoComponent {}
