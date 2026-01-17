import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { KeyValuePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  CharacterType,
  characterTypeName,
  characterTypesInOrganicOrder,
} from '../../../constants';
import { CharacterCardComponent } from '../../../game/ui/character-card/character-card.component';
import { Character } from '../../../typings';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private keyValuePipe = inject(KeyValuePipe);
  characterTypeNames = characterTypeName;
}
