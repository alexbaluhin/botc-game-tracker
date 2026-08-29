import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { KeyValuePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import {
  CharacterType,
  characterTypeName,
  characterTypesInOrganicOrder,
} from '../../../constants';
import { CharacterCardComponent } from '../../../game/ui/character-card/character-card.component';
import { Character } from '../../types/common';

@Component({
  selector: 'app-characters-expandable-list',
  imports: [
    CdkAccordion,
    CdkAccordionItem,
    CharacterCardComponent,
    NgOptimizedImage,
  ],
  providers: [KeyValuePipe],
  templateUrl: './characters-expandable-list.component.html',
  styleUrl: './characters-expandable-list.component.scss',
})
export class CharactersExpandableListComponent {
  characters = input.required<Character[]>();
  charactersGroupedByType = computed(() => {
    const characterTypes = this.characters().reduce(
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
    );
    return this.keyValuePipe.transform<CharacterType, Character[]>(
      characterTypes,
      (a, b) =>
        characterTypesInOrganicOrder.indexOf(a.key) >
        characterTypesInOrganicOrder.indexOf(b.key)
          ? 1
          : -1
    );
  });
  selectedCharacter = output<Character>();

  private keyValuePipe = inject(KeyValuePipe);
  characterTypeNames = characterTypeName;
}
