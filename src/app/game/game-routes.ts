import { Routes } from '@angular/router';
import { GrimoireService } from './data-access/grimoire.service';
import { GossipViewComponent } from './features/gossip-view/gossip-view.component';
import { PlayersViewComponent } from './features/players-view/players-view.component';
import { ScriptViewComponent } from './features/script-view/script-view.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    providers: [GrimoireService],
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
