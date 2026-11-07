import { Dialog } from '@angular/cdk/dialog';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { GameShareService } from './shared/data-access/game-share.service';
import { GameStore, version } from './shared/data-access/game-state-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly themeStorageKey = 'botc-theme';
  readonly isLightMode = signal(this.getInitialTheme() === 'light');

  shareLink = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(
      map(paramMap => paramMap.get('share')),
      filter(shareLink => shareLink !== null)
    )
  );
  router = inject(Router);
  dialog = inject(Dialog);
  gameStore = inject(GameStore);
  gameShareService = inject(GameShareService);

  constructor() {
    effect(() => {
      const theme = this.isLightMode() ? 'light' : 'dark';
      document.documentElement.dataset['theme'] = theme;
      window.localStorage.setItem(this.themeStorageKey, theme);
    });

    effect(() => {
      const shareLink = this.shareLink();
      if (!shareLink) {
        return;
      }

      const gameStateFromLink =
        this.gameShareService.getGameStateFromShareLink(shareLink);
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
            /**
             * because we need for PlayersViewComponent to be reinitiated, "reset -> navigate / -> set -> navigate /game" is used
             * TODO: move code from PlayersViewComponent to router provider later
             */
            this.dialog.closeAll();
            this.gameStore.resetGameState();
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.gameStore.setGameStateFromSharedLink(gameStateFromLink);
                this.router.navigate(['/game'], {
                  queryParams: {
                    share: null,
                  },
                  queryParamsHandling: 'merge',
                });
              });
          }
        });
    });

    document.addEventListener('contextmenu', e => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    });
  }

  ngOnInit() {
    this.checkGameStateVersion();
  }

  toggleTheme() {
    this.isLightMode.update(isLight => !isLight);
  }

  private getInitialTheme(): 'light' | 'dark' {
    const savedTheme = window.localStorage.getItem(this.themeStorageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  private checkGameStateVersion() {
    if ((this.gameStore.version() ?? 0) < version) {
      this.dialog
        .open<boolean, ConfirmationDialogData>(ConfirmationDialogComponent, {
          data: {
            message:
              'Your saved game is not compatible with the latest changes. Please click on the "Reset" button, or continue on your own risk.',
            agreeButtonText: 'Reset',
            disagreeButtonText: 'Continue',
          },
        })
        .closed.pipe(filter(reset => reset === true))
        .subscribe(() => {
          this.gameStore.resetGameState();
          this.router.navigate(['/']);
        });
    }
  }
}
