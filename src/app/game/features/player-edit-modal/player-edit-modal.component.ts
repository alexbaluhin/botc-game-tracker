import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CharacterTokenBaseComponent } from '../../../shared/components/character-token-base/character-token-base.component';
import { CharacterTokenComponent } from '../../../shared/components/character-token/character-token.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { Character } from '../../../typings';

export type PlayerEditModalData = {
  playerPositionInCircle: number;
};

@Component({
  selector: 'app-player-edit-modal',
  imports: [
    NgOptimizedImage,
    FormsModule,
    CharacterTokenComponent,
    ActionBarComponent,
    ButtonComponent,
    CharacterTokenBaseComponent,
  ],
  templateUrl: './player-edit-modal.component.html',
  styleUrl: './player-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditModalComponent implements OnInit {
  dialog = inject<DialogRef<never, PlayerEditModalComponent>>(DialogRef);
  private dialogData: PlayerEditModalData = inject(DIALOG_DATA);
  gameStateService = inject(GameStateService);

  playerName = model<string>();
  isMySeat = false;
  selectedCharacter: Character | null = null;

  ngOnInit() {
    const player = this.gameStateService.getPlayerByIndex(
      this.dialogData.playerPositionInCircle
    );
    if (player.name) {
      this.playerName.set(player.name);
    }
    if (player.character) {
      this.selectedCharacter = player.character;
    }
    this.isMySeat = player.isCurrentViewer ?? false;
  }

  toggleMySeat() {
    this.isMySeat = !this.isMySeat;
    this.selectedCharacter = null;
  }

  selectCharacter(character: Character) {
    if (this.selectedCharacter?.id === character.id) {
      this.selectedCharacter = null;
    } else {
      this.selectedCharacter = character;
    }
    this.isMySeat = false;
  }

  savePlayerInfo() {
    this.gameStateService.updatePlayerByIndex(
      this.dialogData.playerPositionInCircle,
      {
        name: this.playerName(),
        isCurrentViewer: this.isMySeat,
        ...(this.selectedCharacter
          ? { character: this.selectedCharacter }
          : {}),
      }
    );
    this.dialog.close();
  }

  clearAll() {
    this.playerName.set('');
    this.isMySeat = false;
    this.selectedCharacter = null;
  }
}
