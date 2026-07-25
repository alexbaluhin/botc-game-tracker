import { inject } from '@angular/core';
import { RedirectCommand, Router, Routes } from '@angular/router';
import { GameStore } from '../shared/data-access/game-state-store';
import { BluffsViewComponent } from './features/bluffs-view/bluffs-view.component';
import { GossipViewComponent } from './features/gossip-view/gossip-view.component';
import { PlayersViewComponent } from './features/players-view/players-view.component';
import { ScriptViewComponent } from './features/script-view/script-view.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    canActivate: [
      () => {
        const router = inject(Router);
        const gameStore = inject(GameStore);
        return gameStore.gameWasSetUp()
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
      {
        path: 'bluffs',
        component: BluffsViewComponent,
      },
    ],
  },
];
