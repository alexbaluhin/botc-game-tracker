import { Dialog } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
  signal,
  untracked,
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

  private speechRecognition: SpeechRecognition | null = null;
  isRecording = signal(false);
  transcriptText: string | null = null;

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
  textInputContent = untracked(() => this.text());

  togglePlayerSelection(player: string) {
    if (this.selectedPlayers().includes(player)) {
      this.selectedPlayers.update(players => players.filter(p => p !== player));
    } else {
      this.selectedPlayers.update(players => [...players, player]);
    }
  }

  focusOnInput() {
    if (this.isRecording()) {
      return;
    }
    this.textInput()?.nativeElement?.focus();
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
    const lastPlayer = this.selectedPlayers().at(-1);
    if (!this.text() && lastPlayer) {
      this.togglePlayerSelection(lastPlayer);
    }
  }

  saveNote() {
    this.gameStore.addNote({
      playerNames: this.selectedPlayers(),
      text: this.text()!,
    });

    this.selectedPlayers.set([]);
    this.setInputText('');
  }

  editNote(savedNote: Note) {
    this.selectedPlayers.set(savedNote.playerNames);
    this.setInputText(savedNote.text);
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

  async recordAudio() {
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = 'ru-RU';
    this.speechRecognition.interimResults = true;
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.processLocally = true;

    this.speechRecognition.onresult = event => {
      this.transcriptText = [...event.results]
        .map(part => part[0].transcript)
        .join(' ');
    };

    const speechRecognitionOptions: SpeechRecognitionOptions = {
      langs: ['ru-RU'],
      processLocally: true,
    };

    const availabilityStatus = await SpeechRecognition.available(
      speechRecognitionOptions
    );
    if (availabilityStatus === 'unavailable') {
      return;
    }

    if (availabilityStatus === 'available') {
      this.speechRecognition.start();
      this.isRecording.set(true);
      return;
    }

    const installed = await SpeechRecognition.install(speechRecognitionOptions);
    if (installed) {
      this.speechRecognition.start();
      this.isRecording.set(true);
    }
  }

  stopRecording() {
    this.speechRecognition?.stop();
    this.speechRecognition = null;
    const finalText = [this.text(), this.transcriptText!]
      .filter(t => !!t)
      .join(' ');
    this.setInputText(finalText);
    this.transcriptText = null;
    this.isRecording.set(false);
  }

  private setInputText(text: string) {
    this.text.set(text);
    this.textInputContent = text;
  }
}
