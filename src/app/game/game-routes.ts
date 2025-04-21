import { Routes } from '@angular/router';
import { PlayersViewComponent } from './features/players-view/players-view.component';
import { ScriptViewComponent } from './features/script-view/script-view.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    children: [
      {
        path: '',
        component: PlayersViewComponent,
      },
      {
        path: 'script',
        component: ScriptViewComponent,
      },
    ],
  },
];
