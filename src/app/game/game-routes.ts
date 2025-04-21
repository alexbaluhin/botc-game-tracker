import { Routes } from '@angular/router';
import { PlayersViewComponent } from './features/players-view/players-view.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    children: [
      {
        path: '',
        component: PlayersViewComponent,
      },
      {
        path: 'players',
        component: PlayersViewComponent,
      },
    ],
  },
];
