import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { gameSetupRoutes } from './game-setup/game-setup-routes';
import { gameRoutes } from './game/game-routes';
import { GameStore } from './shared/data-access/game-state-store';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: () => {
      const gameStore = inject(GameStore);
      return gameStore.gameWasSetUp() ? 'game' : 'game-setup';
    },
  },
  ...gameSetupRoutes,
  ...gameRoutes,
];
