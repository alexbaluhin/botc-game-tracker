import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconButtonComponent } from '../../../shared/components/icon-button/icon-button.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';

@Component({
  selector: 'app-game-nav',
  imports: [IconButtonComponent, NgOptimizedImage],
  templateUrl: './game-nav.component.html',
  styleUrl: './game-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameNavComponent {
  private gameStateService = inject(GameStateService);
  private router = inject(Router);

  resetGame() {
    this.gameStateService.resetGameState();
    this.router.navigate(['/']);
  }
}
