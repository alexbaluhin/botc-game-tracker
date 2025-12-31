import { CdkDrag, CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { Player, Reminder } from 'src/app/typings';
import { calculatePlayerTokenSize } from '../../layout/players-circle';
import { GrimoireStarCenterComponent } from '../grimoire-star-center/grimoire-star-center.component';
import { PlayerTokenComponent } from '../player-token/player-token.component';
import { ReminderTokenComponent } from '../reminder-token/reminder-token.component';

@Component({
  selector: 'app-grimoire',
  templateUrl: './grimoire.component.html',
  styleUrl: './grimoire.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PlayerTokenComponent,
    NgOptimizedImage,
    CdkDrag,
    GrimoireStarCenterComponent,
    ReminderTokenComponent,
  ],
})
export class GrimoireComponent {
  setupMode = input.required<boolean>();
  players = input.required<Player[]>();
  reminders = input.required<Reminder[]>();

  playerClicked = output<number>();
  playerTokenMoved = output<{ index: number; position: Point }>();

  reminderClicked = output<number>();
  reminderTokenMoved = output<{ index: number; position: Point }>();

  grimoireElement = inject<ElementRef<HTMLElement>>(ElementRef);

  playerTokenSize = computed(() =>
    calculatePlayerTokenSize(this.players().length)
  );
  reminderTokenSize = computed(() => 40); // TODO: calculate its

  isDragging: boolean = false;

  xmasSpecialGrimoire: boolean = true;

  playerTokenClicked(index: number) {
    if (!this.isDragging) {
      this.playerClicked.emit(index);
    }
  }

  reminderTokenClicked(index: number) {
    if (!this.isDragging) {
      this.reminderClicked.emit(index);
    }
  }

  playerTokenDraggingEnd(event: CdkDragEnd, index: number, player: Player) {
    this.playerTokenMoved.emit({
      index,
      position: {
        x: player.positionInGrimoire.x + event.distance.x,
        y: player.positionInGrimoire.y + event.distance.y,
      },
    });
    this.draggingEnd();
  }

  reminderTokenDraggingEnd(
    event: CdkDragEnd,
    index: number,
    reminder: Reminder
  ) {
    this.reminderTokenMoved.emit({
      index,
      position: {
        x: reminder.positionInGrimoire.x + event.distance.x,
        y: reminder.positionInGrimoire.y + event.distance.y,
      },
    });
    this.draggingEnd();
  }

  private draggingEnd() {
    setTimeout(() => (this.isDragging = false));
  }
}
