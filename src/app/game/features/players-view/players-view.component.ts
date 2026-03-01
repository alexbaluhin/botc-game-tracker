import { Dialog } from '@angular/cdk/dialog';
import { Point } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
  afterNextRender,
  Injector,
} from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { GrimoireComponent } from '../../../shared/components/grimoire/grimoire.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { GrimoireService } from '../../data-access/grimoire.service';
import { GameHeaderComponent } from '../../ui/game-header/game-header.component';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';
import {
  PlayerEditModalComponent,
  PlayerEditModalData,
} from '../player-edit-modal/player-edit-modal.component';
import {
  RemoveReminderDialogData,
  RemoveReminderModalComponent,
} from '../remove-reminder-modal/remove-reminder-modal.component';

@Component({
  selector: 'app-players-view',
  imports: [
    ActionBarComponent,
    GrimoireComponent,
    GameNavComponent,
    GameHeaderComponent,
  ],
  templateUrl: './players-view.component.html',
  styleUrl: './players-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersViewComponent {
  gameStore = inject(GameStore);
  grimoireService = inject(GrimoireService);
  private dialog = inject(Dialog);
  private injector = inject(Injector);

  grimoireElement = viewChild.required<GrimoireComponent, ElementRef>(
    GrimoireComponent,
    {
      read: ElementRef,
    }
  );

  constructor() {
    afterNextRender(() => {
      this.grimoireService.setGrimoireElement(
        this.grimoireElement().nativeElement
      );

      if (this.gameStore.arePlayersPositionsCalculated()) {
        return;
      }

      this.gameStore.calculatePlayersPositionsInCircle(
        this.grimoireElement().nativeElement.getBoundingClientRect()
      );
    });
  }

  editPlayer(index: number) {
    this.dialog.open<PlayerEditModalComponent, PlayerEditModalData>(
      PlayerEditModalComponent,
      {
        width: '74%',
        maxWidth: '291px',
        data: {
          playerPositionInCircle: index,
        },
        autoFocus: false,
        injector: this.injector,
      }
    );
  }

  updatePlayerTokenPosition(event: { index: number; position: Point }) {
    this.gameStore.updatePlayerByIndex(event.index, {
      ...this.gameStore.getPlayerByIndex(event.index),
      positionInGrimoire: event.position,
    });
  }

  removeReminder(index: number) {
    this.dialog
      .open<RemoveReminderModalComponent, RemoveReminderDialogData>(
        RemoveReminderModalComponent,
        {
          width: '74%',
          maxWidth: '291px',
          data: {
            reminder: this.gameStore.getReminderByIndex(index),
          },
          autoFocus: false,
        }
      )
      .closed.subscribe(() => this.dialog.closeAll());
  }

  updateReminderTokenPosition(event: { index: number; position: Point }) {
    this.gameStore.updateReminderByIndex(event.index, {
      ...this.gameStore.getReminderByIndex(event.index),
      positionInGrimoire: event.position,
    });
  }
}
