import { Dialog } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { GameStore } from '../../../shared/data-access/game-state-store';
import { Note, Player } from '../../../shared/types/common';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';
import {
  RemoveNoteDialogData,
  RemoveNoteModalComponent,
} from '../remove-note-modal/remove-note-modal.component';

@Component({
  selector: 'app-info-view',
  imports: [
    ActionBarComponent,
    GameNavComponent,
    FormsModule,
    ChipComponent,
    ButtonComponent,
    NgOptimizedImage,
  ],
  templateUrl: './info-view.component.html',
  styleUrl: './info-view.component.scss',
})
export class InfoViewComponent {
  private gameStore = inject(GameStore);
  private dialog = inject(Dialog);

  playersNames = computed(() =>
    this.gameStore
      .players()
      .filter((player): player is Required<Player> => !!player.name)
      .map(player => player.name)
  );
  savedNotes = computed<Note[]>(() => this.gameStore.notes().reverse());

  selectedPlayers = model<string[]>([]);
  text = model<string>();
  textInput = viewChild<ElementRef<HTMLSpanElement>>('textInput');

  inEditMode = signal(false);
  noteBeingEditedIndex = signal<number | null>(null);

  get textInputNativeElement() {
    return this.textInput()?.nativeElement;
  }

  togglePlayerSelection(player: string) {
    if (this.selectedPlayers().includes(player)) {
      this.selectedPlayers.update(players => players.filter(p => p !== player));
    } else {
      this.selectedPlayers.update(players => [...players, player]);
    }
  }

  focusOnInput() {
    if (
      !this.textInputNativeElement ||
      document.activeElement === this.textInputNativeElement
    ) {
      return;
    }

    this.textInputNativeElement.focus();
    requestAnimationFrame(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(this.textInputNativeElement!);
      range.collapse(false); // false = collapse to end
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  }

  updateText(el: EventTarget | null) {
    if (!el) {
      return;
    }
    const spanEl = el as HTMLSpanElement;
    const text = spanEl.textContent;
    // remove <br> left after erase
    if (text === '') {
      spanEl.textContent = '';
    }
    this.text.set(text);
  }

  removeLastChipIfApplicable() {
    if (this.text()) {
      return;
    }
    const lastPlayer = this.selectedPlayers().at(-1);
    if (!this.text() && lastPlayer) {
      this.togglePlayerSelection(lastPlayer);
    }
  }

  saveNote() {
    if (this.inEditMode() && this.noteBeingEditedIndex() !== null) {
      this.gameStore.updateNote(
        {
          playerNames: this.selectedPlayers(),
          text: this.text()!,
        },
        this.noteBeingEditedIndex()!
      );
    } else {
      this.gameStore.addNote({
        playerNames: this.selectedPlayers(),
        text: this.text()!,
      });
    }

    this.finishEdit();
  }

  editNote(savedNote: Note, index: number) {
    this.selectedPlayers.set(savedNote.playerNames);
    this.setInputText(savedNote.text);
    this.inEditMode.set(true);
    this.noteBeingEditedIndex.set(index);
  }

  finishEdit() {
    this.selectedPlayers.set([]);
    this.setInputText('');
    this.inEditMode.set(false);
    this.noteBeingEditedIndex.set(null);
  }

  deleteNote(indexOfNoteToRemove: number) {
    this.dialog
      .open<RemoveNoteModalComponent, RemoveNoteDialogData>(
        RemoveNoteModalComponent,
        {
          width: '74%',
          maxWidth: '291px',
          data: {
            indexOfNoteToRemove: indexOfNoteToRemove,
          },
          autoFocus: false,
        }
      )
      .closed.subscribe(() => this.dialog.closeAll());
  }

  private setInputText(text: string) {
    this.text.set(text);
    if (this.textInputNativeElement) {
      this.textInputNativeElement.textContent = text;
    }
  }
}
