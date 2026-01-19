import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameNavLinkComponent } from '../game-nav-link/game-nav-link.component';

@Component({
  selector: 'app-game-nav',
  imports: [GameNavLinkComponent, NgOptimizedImage],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameNavComponent {}
