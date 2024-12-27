import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GameSetupInfoService } from '../../data-access/game-setup-info.service';
import { CounterComponent } from '../../ui/counter/counter.component';
import { GameSetupHeaderComponent } from '../../ui/game-setup-header/game-setup-header.component';

interface Player {
  name?: string;
}

@Component({
  selector: 'app-players-count-selection',
  imports: [
    GameSetupHeaderComponent,
    ActionBarComponent,
    MatButtonModule,
    CounterComponent,
    FormsModule,
  ],
  templateUrl: './players-count-selection.component.html',
  styleUrls: ['./players-count-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersCountSelectionComponent {
  router = inject(Router);
  gameSetupInfoService = inject(GameSetupInfoService);
  playersCount = 12;
  players: Player[] = new Array(this.playersCount).fill({});

  onPlayersCountChange(newCount: number) {
    this.playersCount = newCount;
    if (this.players.length < this.playersCount) {
      this.players.push({});
    } else {
      this.players.pop();
    }
  }

  acceptPlayersCount() {
    this.gameSetupInfoService.setPlayersCount(this.playersCount);
    this.router.navigate(['characters-selection']);
  }
}
