import { Routes } from '@angular/router';
import { CharactersSelectionComponent } from './features/characters-selection/characters-selection.component';
import { ModeSelectionComponent } from './features/mode-selection/mode-selection.component';
import { PlayersCountSelectionComponent } from './features/players-count-selection/players-count-selection.component';
import { ScriptSelectionComponent } from './features/script-selection/script-selection.component';
import { GameSetupComponent } from './game-setup.component';

export const gameSetupRoutes: Routes = [
  {
    path: '',
    component: GameSetupComponent,
    children: [
      {
        path: '',
        component: ModeSelectionComponent,
      },
      {
        path: 'script-selection',
        component: ScriptSelectionComponent,
      },
      {
        path: 'players-count-selection',
        component: PlayersCountSelectionComponent,
      },
      {
        path: 'characters-selection',
        component: CharactersSelectionComponent,
      },
    ],
  },
];
