import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { Gossip } from '../../../typings';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';

export type Day = {
  label: string;
  value: number;
};

export type SavedGossip = Omit<Gossip, 'day'> & {
  day: Day;
};

@Component({
  selector: 'app-gossip-view',
  imports: [
    ActionBarComponent,
    GameNavComponent,
    FormsModule,
    ChipComponent,
    ButtonComponent,
  ],
  templateUrl: './gossip-view.component.html',
  styleUrl: './gossip-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GossipViewComponent {
  gameStateService = inject(GameStateService);

  days: Day[] = [
    {
      label: 'd 1',
      value: 1,
    },
    {
      label: 'd 2',
      value: 2,
    },
    {
      label: 'd 3',
      value: 3,
    },
    {
      label: 'd 4',
      value: 4,
    },
    {
      label: 'd 5',
      value: 5,
    },
    {
      label: 'd 6',
      value: 6,
    },
    {
      label: 'd 7',
      value: 7,
    },
    {
      label: 'd 8',
      value: 8,
    },
  ];
  playersWithNames = computed(() =>
    this.gameStateService.info().players.filter(player => !!player.name)
  );
  savedGossips = computed<SavedGossip[]>(() =>
    this.gameStateService
      .info()
      .gossips.map(gossip => ({
        ...gossip,
        day: this.days.find(day => day.value === gossip.day)!,
      }))
      .reverse()
  );

  selectedDay = model<number>();
  selectedPlayer = model<string>();
  gossip = model<string>();

  selectDay(day: number) {
    this.selectedDay.set(day);
    this.findAndApplyOrResetGossipCombination();
  }

  selectPlayer(player: string) {
    this.selectedPlayer.set(player);
    this.findAndApplyOrResetGossipCombination();
  }

  saveGossip() {
    this.gameStateService.updateGossip({
      day: this.selectedDay()!,
      playerName: this.selectedPlayer()!,
      gossip: this.gossip()!,
    });

    this.selectedDay.set(undefined);
    this.selectedPlayer.set(undefined);
    this.gossip.set(undefined);
  }

  editGossip(savedGossip: SavedGossip) {
    this.selectedDay.set(savedGossip.day.value);
    this.selectedPlayer.set(savedGossip.playerName);
    this.gossip.set(savedGossip.gossip);
  }

  private findAndApplyOrResetGossipCombination() {
    const savedGossip = this.savedGossips().find(
      savedGossip =>
        savedGossip.day.value === this.selectedDay() &&
        savedGossip.playerName === this.selectedPlayer()
    );
    if (savedGossip) {
      this.gossip.set(savedGossip.gossip);
    } else {
      this.gossip.set('');
    }
  }
}
