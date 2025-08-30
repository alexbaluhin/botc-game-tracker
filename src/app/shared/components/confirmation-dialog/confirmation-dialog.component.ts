import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

export type ConfirmationDialogData = {
  message: string;
};

@Component({
  selector: 'app-confirmation-dialog',
  imports: [ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialogComponent {
  dialogRef = inject<DialogRef<boolean>>(DialogRef<boolean>);
  dialogData: ConfirmationDialogData = inject(DIALOG_DATA);
}
