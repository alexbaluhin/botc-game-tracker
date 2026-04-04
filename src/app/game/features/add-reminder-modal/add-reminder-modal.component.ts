import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { ReminderTokenComponent } from '../../../shared/components/reminder-token/reminder-token.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { Reminder } from '../../../typings';
import { GrimoireService } from '../../data-access/grimoire.service';

@Component({
  selector: 'app-add-reminder-modal',
  imports: [GameModalComponent, FormsModule, ReminderTokenComponent],
  templateUrl: './add-reminder-modal.component.html',
  styleUrl: './add-reminder-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddReminderModalComponent {
  private gameStore = inject(GameStore);
  private dialogRef =
    inject<DialogRef<never, AddReminderModalComponent>>(DialogRef);
  private grimoireService = inject(GrimoireService);

  reminders = computed(() => {
    const domRect = this.grimoireService
      .getGrimoireElement()!
      .getBoundingClientRect();
    const centerX = domRect.width / 2 - 20;
    const centerY = domRect.height / 2 - 20;
    return this.gameStore.characters().reduce(
      (reminders, character) => [
        ...reminders,
        ...character.reminderTokens.map(reminderToken => ({
          relatedCharacter: character,
          text: reminderToken,
          positionInGrimoire: { x: centerX, y: centerY },
        })),
      ],
      [] as Reminder[]
    );
  });

  selectReminder(reminder: Reminder) {
    this.gameStore.addReminder(reminder);
    this.dialogRef.close();
  }
}
