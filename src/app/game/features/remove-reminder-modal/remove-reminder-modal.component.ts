import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { Reminder } from '../../../typings';

export type RemoveReminderDialogData = {
  reminder: Reminder;
};

@Component({
  selector: 'app-remove-reminder-modal',
  imports: [GameModalComponent, ButtonComponent],
  templateUrl: './remove-reminder-modal.component.html',
  styleUrl: './remove-reminder-modal.component.scss',
})
export class RemoveReminderModalComponent {
  private dialogRef =
    inject<DialogRef<never, RemoveReminderModalComponent>>(DialogRef);
  private dialogData: RemoveReminderDialogData = inject(DIALOG_DATA);
  private gameStore = inject(GameStore);

  removeReminder() {
    this.gameStore.removeReminder(this.dialogData.reminder);
    this.dialogRef.close();
  }
}
