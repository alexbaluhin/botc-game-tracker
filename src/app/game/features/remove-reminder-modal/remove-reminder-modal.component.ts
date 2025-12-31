import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { Reminder } from '../../../typings';

export type RemoveReminderDialogData = {
  reminder: Reminder;
};

@Component({
  selector: 'app-remove-reminder-modal',
  imports: [GameModalComponent, ButtonComponent],
  templateUrl: './remove-reminder-modal.component.html',
  styleUrl: './remove-reminder-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveReminderModalComponent {
  private dialogRef =
    inject<DialogRef<never, RemoveReminderModalComponent>>(DialogRef);
  private dialogData: RemoveReminderDialogData = inject(DIALOG_DATA);
  private gameStateService = inject(GameStateService);

  removeReminder() {
    this.gameStateService.removeReminder(this.dialogData.reminder);
    this.dialogRef.close();
  }
}
