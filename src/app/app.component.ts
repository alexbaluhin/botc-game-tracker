import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { GameStateService } from './shared/data-access/game-state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  shareLink = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map(paramMap => paramMap.get('share')),
      filter(shareLink => shareLink !== null)
    )
  );
  router = inject(Router);
  dialog = inject(Dialog);
  gameStateService = inject(GameStateService);

  constructor() {
    effect(() => {
      const shareLink = this.shareLink();
      if (!shareLink) {
        return;
      }

      const gameStateFromLink =
        this.gameStateService.getGameStateFromShareLink(shareLink);
      this.dialog
        .open<ConfirmationDialogComponent, ConfirmationDialogData>(
          ConfirmationDialogComponent,
          {
            data: {
              message: `Do you want to load a new room "${gameStateFromLink.name}"? It will reset your current, if any!`,
            },
          }
        )
        .closed.subscribe(result => {
          if (result) {
            this.gameStateService.info.set(gameStateFromLink);
            this.router.navigate([], {
              queryParams: {
                share: null,
              },
              queryParamsHandling: 'merge',
            });
          }
        });
    });
  }
}
