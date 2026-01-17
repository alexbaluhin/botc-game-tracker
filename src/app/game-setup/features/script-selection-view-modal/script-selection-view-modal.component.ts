import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CharactersExpandableListComponent } from '../../../shared/components/characters-expandable-list/characters-expandable-list.component';
import { ScriptForSelection } from '../../typings';

export type ScriptSelectionViewModalData = {
  script: ScriptForSelection;
};

@Component({
  selector: 'app-script-selection-view-modal',
  imports: [
    ActionBarComponent,
    NgOptimizedImage,
    ButtonComponent,
    CharactersExpandableListComponent,
  ],
  templateUrl: './script-selection-view-modal.component.html',
  styleUrl: './script-selection-view-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptSelectionViewModalComponent {
  private dialogRef =
    inject<DialogRef<boolean, ScriptSelectionViewModalComponent>>(DialogRef);
  data: ScriptSelectionViewModalData = inject(DIALOG_DATA);

  close(confirmScript: boolean) {
    this.dialogRef.close(confirmScript);
  }
}
