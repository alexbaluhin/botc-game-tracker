import { Routes } from '@angular/router';
import { PlayersViewComponent } from './features/players-view/players-view.component';
import { GameComponent } from './game.component';

export const gameRoutes: Routes = [
  {
    path: 'game',
    component: GameComponent,
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
