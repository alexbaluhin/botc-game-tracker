import { Clipboard } from '@angular/cdk/clipboard';
import { Dialog } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersCountPerTypeHintComponent } from '../../../shared/components/characters-count-per-type-hint/characters-count-per-type-hint.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';

@Component({
  selector: 'app-game-header',
  imports: [
    CharactersCountPerTypeHintComponent,
    CdkMenuTrigger,
    NgOptimizedImage,
    CdkMenu,
    CdkMenuItem,
  ],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHeaderComponent {
  gameStateService = inject(GameStateService);
  private dialog = inject(Dialog);
  private router = inject(Router);
  private clipboard = inject(Clipboard);

  canUseMobileShare = 'share' in navigator;
  shareText = this.canUseMobileShare ? 'Share room' : 'Copy link to room';

  resetGame() {
    this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData>(
        ConfirmationDialogComponent,
        {
          data: {
            message: 'Would you like to reset your game?',
          },
        }
      )
      .closed.subscribe(result => {
        if (result) {
          this.gameStateService.resetGameState();
          this.router.navigate(['/']);
        }
      });
  }

  share() {
    const shareLink = this.gameStateService.createShareLink();
    if (this.canUseMobileShare) {
      window.navigator.share({ url: shareLink });
    } else {
      this.clipboard.copy(shareLink);
    }
  }
}
