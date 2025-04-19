import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { gameSetupRoutes } from './game-setup/game-setup-routes';
import { gameRoutes } from './game/game-routes';
import { GameStateService } from './shared/data-access/game-state.service';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: () => {
      const gameStateService = inject(GameStateService);
      return gameStateService.gameWasSetUp ? 'game' : 'game-setup';
    },
  },
  ...gameSetupRoutes,
  ...gameRoutes,
];
