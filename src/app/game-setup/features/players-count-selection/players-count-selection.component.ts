import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { charactersCountBasedOnPlayersCount } from '../../../constants';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CharactersCountPerTypeHintComponent } from '../../../shared/components/characters-count-per-type-hint/characters-count-per-type-hint.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { Player } from '../../../typings';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { CounterComponent } from '../../ui/counter/counter.component';
import { GameSetupHeaderComponent } from '../../ui/game-setup-header/game-setup-header.component';

@Component({
  selector: 'app-players-count-selection',
  imports: [
    GameSetupHeaderComponent,
    ActionBarComponent,
    CounterComponent,
    FormsModule,
    GrimoireComponent,
    ButtonComponent,
    CharactersCountPerTypeHintComponent,
  ],
  templateUrl: './players-count-selection.component.html',
  styleUrls: ['./players-count-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersCountSelectionComponent {
  router = inject(Router);
  gameStateService = inject(GameStateService);
  minCount = +Object.keys(charactersCountBasedOnPlayersCount).at(0)!;
  maxCount = +Object.keys(charactersCountBasedOnPlayersCount).at(-1)!;

  players = signal<Player[]>(new Array(12).fill({}));

  onPlayersCountChange(newCount: number) {
    if (this.players().length < newCount) {
      this.players.update(players => [...players, {}]);
    } else {
      this.players.update(players => players.slice(0, -1));
    }
  }

  acceptPlayersCount() {
    this.gameStateService.setPlayersCount(this.players().length);
    this.router.navigate(['/game']);
  }
}
