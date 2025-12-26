import { inject } from '@angular/core';
import { RedirectCommand, Router, Routes } from '@angular/router';
import { GameStateService } from '../shared/data-access/game-state.service';
import { GrimoireService } from './data-access/grimoire.service';
import { GossipViewComponent } from './features/gossip-view/gossip-view.component';
import { PlayersViewComponent } from './features/players-view/players-view.component';
import { ScriptViewComponent } from './features/script-view/script-view.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    providers: [GrimoireService],
    canActivate: [
      () => {
        const router = inject(Router);
        const gameStateService = inject(GameStateService);
        return gameStateService.gameWasSetUp
          ? true
          : new RedirectCommand(router.parseUrl('/'));
      },
    ],
    children: [
      {
        path: '',
        component: PlayersViewComponent,
      },
      {
        path: 'script',
        component: ScriptViewComponent,
      },
      {
        path: 'gossip',
        component: GossipViewComponent,
      },
    ],
  },
];
