import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterType } from '../../../constants';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
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
  ],
  templateUrl: './character-edit-modal.component.html',
  styleUrl: './character-edit-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditModalComponent implements OnInit {
  dialog = inject<DialogRef<never, CharacterEditModalComponent>>(DialogRef);
  private dialogData: PlayerEditModalData = inject(DIALOG_DATA);
  gameStateService = inject(GameStateService);

  player = this.gameStateService.getPlayerByIndex(
    this.dialogData.playerPositionInCircle
  );

  isMySeat = false;
  selectedCharacters = signal<{ [id in string]: Character }>({});

  charactersGroupedByType = computed(() =>
    Object.values(
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
        .reduce(
          (acc, character) => {
            if (!acc[character.type]) {
              return {
                ...acc,
                [character.type]: [character],
              };
            }
            return {
              ...acc,
              [character.type]: [...acc[character.type], character],
            };
          },
          {} as { [key in CharacterType]: Character[] }
        )
    )
  );

  ngOnInit() {
    this.isMySeat = this.player.isCurrentViewer ?? false;
    if (this.player.characters.length && !this.isMySeat) {
      this.selectedCharacters.set(
        this.player.characters.reduce(
          (acc, character) => ({ ...acc, [character.id]: character }),
          {}
        )
      );
    }
  }

  toggleMySeat() {
    this.isMySeat = !this.isMySeat;
    this.selectedCharacters.set({});
  }

  selectCharacter(character: Character) {
    if (this.selectedCharacters()[character.id]) {
      this.selectedCharacters.update(selectedCharacters => {
        delete selectedCharacters[character.id];
        return selectedCharacters;
      });
    } else {
      this.selectedCharacters.update(selectedCharacters => {
        if (Object.keys(selectedCharacters).length >= 3) {
          delete selectedCharacters[Object.keys(selectedCharacters)[0]];
          return { ...selectedCharacters, [character.id]: character };
        }
        return { ...selectedCharacters, [character.id]: character };
      });
    }
    this.isMySeat = false;
  }

  savePlayerInfo() {
    this.gameStateService.updatePlayerByIndex(
      this.dialogData.playerPositionInCircle,
      {
        ...this.player,
        isCurrentViewer: this.isMySeat,
        characters: Object.values(this.selectedCharacters()),
      }
    );
    this.dialog.close();
  }
}
