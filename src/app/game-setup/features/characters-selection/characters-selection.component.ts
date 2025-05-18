import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  charactersCountBasedOnPlayersCount,
  CharacterType,
  characterTypeName,
} from '../../../constants';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { CharacterTokenComponent } from '../../../shared/components/character-token/character-token.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { charactersSetupChanges } from '../../setup-changes';
import {
  CharacterForSelection,
  CharactersCategory,
  DataForSetupChange,
  MaxCountsDataForSetupChange,
} from '../../typings';
import { GameSetupHeaderComponent } from '../../ui/game-setup-header/game-setup-header.component';

@Component({
  selector: 'app-characters-selection',
  imports: [
    ActionBarComponent,
    GameSetupHeaderComponent,
    CharacterTokenComponent,
  ],
  templateUrl: './characters-selection.component.html',
  styleUrls: ['./characters-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersSelectionComponent implements OnInit {
  router = inject(Router);
  gameStateService = inject(GameStateService);

  baseMaxCharactersCounts =
    charactersCountBasedOnPlayersCount[
      this.gameStateService.info().players.length
    ];
  baseCharactersCategories: CharactersCategory[] = [];
  charactersCategories: WritableSignal<CharactersCategory[]> = signal([]);
  selectedCharactersToChangeSetup: Set<string> = new Set();

  ngOnInit() {
    this.baseCharactersCategories = this.gameStateService
      .info()
      .characters.reduce((acc, character) => {
        const characterType = character.type;
        const charactersForSelection = acc.find(
          charactersForSelection =>
            charactersForSelection.type === characterType
        );

        if (!charactersForSelection) {
          acc.push({
            name: characterTypeName[characterType],
            type: characterType,
            characters: [character],
            maxCounts:
              characterType === CharacterType.TRAVELLER ||
              characterType === CharacterType.FABLED
                ? undefined
                : ([
                    this.baseMaxCharactersCounts[characterType],
                    this.baseMaxCharactersCounts[characterType],
                  ] as [number, number]),
            selectedCount: 0,
            isFilled: false,
          });
        } else {
          charactersForSelection.characters.push(character);
        }

        return acc;
      }, [] as CharactersCategory[]);
    this.charactersCategories.set(this.baseCharactersCategories);
  }

  onCharacterSelection(
    isSelected: boolean,
    changedCharacter: CharacterForSelection,
    charactersCategory: CharactersCategory
  ) {
    if (!charactersCategory || (charactersCategory.isFilled && isSelected)) {
      return;
    }

    let newCharactersCategories = this.charactersCategories().map(
      charactersCategory => {
        if (charactersCategory.type !== changedCharacter.type) {
          return charactersCategory;
        }

        const selectedCount = isSelected
          ? charactersCategory.selectedCount + 1
          : charactersCategory.selectedCount - 1;
        const isFilled = !charactersCategory.maxCounts
          ? false
          : selectedCount === charactersCategory.maxCounts[0] ||
            selectedCount === charactersCategory.maxCounts[1];

        return {
          ...charactersCategory,
          selectedCount,
          isFilled,
          characters:
            charactersCategory.type === changedCharacter.type
              ? charactersCategory.characters.map(character => ({
                  ...character,
                  selected:
                    character.id === changedCharacter.id
                      ? isSelected
                      : character.selected,
                }))
              : charactersCategory.characters,
        };
      }
    );

    if (changedCharacter.id in charactersSetupChanges) {
      if (isSelected) {
        this.selectedCharactersToChangeSetup.add(changedCharacter.id);
      } else {
        this.selectedCharactersToChangeSetup.delete(changedCharacter.id);
      }
      newCharactersCategories = this.applySetupChangesBySpecialCharacters(
        newCharactersCategories
      );
    }

    this.charactersCategories.set(newCharactersCategories);
  }

  private applySetupChangesBySpecialCharacters(
    charactersCategories: CharactersCategory[]
  ) {
    let newCharactersCategories = charactersCategories;
    for (const id of this.selectedCharactersToChangeSetup.values()) {
      const dataForSetupChanges =
        this.mapCharactersCategoriesToDataForSetupChange(
          newCharactersCategories
        );
      const dataAfterSetupChanges =
        charactersSetupChanges[id](dataForSetupChanges);
      newCharactersCategories =
        this.applyDataAfterSetupChangeToCharactersCategories(
          newCharactersCategories,
          dataAfterSetupChanges
        );
    }
    return newCharactersCategories;
  }

  private mapCharactersCategoriesToDataForSetupChange(
    charactersCategories: CharactersCategory[]
  ): DataForSetupChange {
    return {
      characters: charactersCategories.flatMap(({ characters }) => characters),
      maxCounts: charactersCategories.reduce((acc, { type, maxCounts }) => {
        if (type === CharacterType.TRAVELLER || type === CharacterType.FABLED) {
          return acc;
        }
        return {
          ...acc,
          [type]: maxCounts,
        };
      }, {} as MaxCountsDataForSetupChange),
    };
  }

  private applyDataAfterSetupChangeToCharactersCategories(
    charactersCategories: CharactersCategory[],
    dataForSetupChange: DataForSetupChange
  ): CharactersCategory[] {
    return charactersCategories.map(charactersCategory => {
      return {
        ...charactersCategory,
        characters: dataForSetupChange.characters.filter(
          characters => characters.type === charactersCategory.type
        ),
        maxCounts:
          charactersCategory.type === CharacterType.TRAVELLER ||
          charactersCategory.type === CharacterType.FABLED
            ? charactersCategory.maxCounts
            : dataForSetupChange.maxCounts[charactersCategory.type],
      };
    });
  }
}
