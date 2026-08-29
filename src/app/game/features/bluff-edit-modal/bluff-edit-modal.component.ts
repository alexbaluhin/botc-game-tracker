import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CharacterTokenComponent } from '../../../shared/components/character-token/character-token.component';
import { GameModalComponent } from '../../../shared/components/game-modal/game-modal.component';
import { Character } from '../../../shared/types/common';
import { BluffSelectionModalComponent } from '../../ui/bluff-selection-modal/bluff-selection-modal.component';

export type BluffEditDialogData = {
  bluff: Character;
};

@Component({
  selector: 'app-bluff-edit-modal',
  imports: [
    FormsModule,
    GameModalComponent,
    ButtonComponent,
    CharacterTokenComponent,
  ],
  templateUrl: './bluff-edit-modal.component.html',
  styleUrl: './bluff-edit-modal.component.scss',
})
export class BluffEditModalComponent {
  dialogRef =
    inject<DialogRef<Character | null, BluffEditModalComponent>>(DialogRef);
  dialogData: BluffEditDialogData = inject(DIALOG_DATA);
  private dialog = inject(Dialog);

  changeSelection() {
    this.dialog
      .open<Character, null, BluffSelectionModalComponent>(
        BluffSelectionModalComponent,
        {
          minWidth: '100%',
          height: '100%',
          autoFocus: false,
        }
      )
      .closed.subscribe(selectedCharacter => {
        this.dialogRef.close(selectedCharacter);
      });
  }
}
