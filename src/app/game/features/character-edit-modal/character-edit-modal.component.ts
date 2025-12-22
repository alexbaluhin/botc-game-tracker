import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterType } from '../../../constants';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CharacterTokenBaseComponent } from '../../../shared/components/character-token-base/character-token-base.component';
import { CharacterTokenComponent } from '../../../shared/components/character-token/character-token.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { Character } from '../../../typings';
import { PlayerEditModalData } from '../player-edit-modal/player-edit-modal.component';

@Component({
  selector: 'app-character-edit-modal',
  imports: [
    NgOptimizedImage,
    FormsModule,
    CharacterTokenComponent,
    ActionBarComponent,
    ButtonComponent,
    CharacterTokenBaseComponent,
  ],
  templateUrl: './character-edit-modal.component.html',
  styleUrl: './character-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditModalComponent implements OnInit {
  dialog = inject<DialogRef<never, CharacterEditModalComponent>>(DialogRef);
  private dialogData: PlayerEditModalData = inject(DIALOG_DATA);
  gameStateService = inject(GameStateService);

  playerName = model<string>();
  isMySeat = false;
  characters = computed(() =>
    this.gameStateService
      .info()
      .characters.filter(({ type }) =>
        [
          CharacterType.TOWNSFOLK,
          CharacterType.OUTSIDER,
          CharacterType.MINION,
          CharacterType.DEMON,
          CharacterType.TRAVELLER,
        ].includes(type)
      )
  );
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
