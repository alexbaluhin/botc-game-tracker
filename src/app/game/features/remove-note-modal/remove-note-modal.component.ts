import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { GameStore } from '../../../shared/data-access/game-state-store';

export type RemoveNoteDialogData = {
  indexOfNoteToRemove: number;
};

@Component({
  selector: 'app-remove-note-modal',
  imports: [GameModalComponent, ButtonComponent],
  templateUrl: './remove-note-modal.component.html',
  styleUrl: './remove-note-modal.component.scss',
})
export class RemoveNoteModalComponent {
  private dialogRef =
    inject<DialogRef<never, RemoveNoteModalComponent>>(DialogRef);
  private dialogData: RemoveNoteDialogData = inject(DIALOG_DATA);
  private gameStore = inject(GameStore);

  removeNote() {
    this.gameStore.removeNote(this.dialogData.indexOfNoteToRemove);
    this.dialogRef.close();
  }
}
