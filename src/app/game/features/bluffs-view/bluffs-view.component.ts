import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { EmptyCardComponent } from '../../../shared/components/empty-card/empty-card.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { Character } from '../../../typings';
import { BluffSelectionModalComponent } from '../../ui/bluff-selection-modal/bluff-selection-modal.component';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';
import {
  BluffEditDialogData,
  BluffEditModalComponent,
} from '../bluff-edit-modal/bluff-edit-modal.component';

@Component({
  selector: 'app-bluffs-view',
  imports: [
    ActionBarComponent,
    GameNavComponent,
    ReactiveFormsModule,
    CharacterCardComponent,
    EmptyCardComponent,
  ],
  templateUrl: './bluffs-view.component.html',
  styleUrl: './bluffs-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BluffsViewComponent {
  gameStore = inject(GameStore);
  bluffs = computed(() => this.gameStore.bluffs());
  private dialog = inject(Dialog);

  selectCharacter(atPosition: number) {
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
        if (selectedCharacter) {
          this.gameStore.setBluff(selectedCharacter, atPosition);
        }
      });
  }

  changeBluff(bluff: Character, atPosition: number) {
    this.dialog
      .open<Character | null, BluffEditDialogData, BluffEditModalComponent>(
        BluffEditModalComponent,
        {
          width: '74%',
          maxWidth: '291px',
          autoFocus: false,
          data: {
            bluff,
          },
        }
      )
      .closed.subscribe(selectedCharacter => {
        if (selectedCharacter !== undefined) {
          this.gameStore.setBluff(selectedCharacter, atPosition);
        }
      });
  }
}
