import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { Player } from '../../../typings';
import { GameSetupInfoService } from '../../data-access/game-setup-info.service';
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
  ],
  templateUrl: './players-count-selection.component.html',
  styleUrls: ['./players-count-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersCountSelectionComponent {
  router = inject(Router);
  gameSetupInfoService = inject(GameSetupInfoService);

  players = signal<Player[]>(new Array(12).fill({}));

  onPlayersCountChange(newCount: number) {
    if (this.players().length < newCount) {
      this.players.update(players => [...players, {}]);
    } else {
      this.players.update(players => players.slice(0, -1));
    }
  }

  acceptPlayersCount() {
    this.gameSetupInfoService.setPlayersCount(this.players().length);
    this.router.navigate(['characters-selection']);
  }
}
