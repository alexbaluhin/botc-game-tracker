import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import {
  KeyValuePipe,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  CharacterType,
  characterTypeName,
  characterTypesInOrganicOrder,
} from '../../../constants';
import { ActionBarComponent } from '../../../shared/components/action-bar/action-bar.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { GameStateService } from '../../../shared/data-access/game-state.service';
import { Character } from '../../../typings';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { GameNavComponent } from '../../ui/game-nav/game-nav.component';

type NightOrderPosition<T> = {
  element: TemplateRef<unknown>;
  character?: Character & T;
};

@Component({
  selector: 'app-scripts-view',
  imports: [
    ActionBarComponent,
    GameNavComponent,
    CharacterCardComponent,
    CdkAccordion,
    CdkAccordionItem,
    NgOptimizedImage,
    ChipComponent,
    CardComponent,
    NgTemplateOutlet,
  ],
  providers: [KeyValuePipe],
  templateUrl: './script-view.component.html',
  styleUrl: './script-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScriptViewComponent {
  private gameStateService = inject(GameStateService);
  private keyValuePipe = inject(KeyValuePipe);

  charactersGroupedByType = computed(() => {
    const characterTypes = this.gameStateService.info().characters.reduce(
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

  characterTypeNames = characterTypeName;

  view: 'script' | 'first-night-order' | 'other-nights-order' = 'script';

  dusk = viewChild('duskCard', { read: TemplateRef });
  dawn = viewChild('dawnCard', { read: TemplateRef });
  minionInfo = viewChild('minionInfoCard', {
    read: TemplateRef,
  });
  demonInfo = viewChild('demonInfoCard', {
    read: TemplateRef,
  });
  nightOrderCharacterCard = viewChild('nightOrderCharacterCard', {
    read: TemplateRef,
  });

  firstNightOrder = computed(() =>
    this.prepareNightOrderElements('firstNightOrder', [
      this.dusk()!,
      this.minionInfo()!,
      this.demonInfo()!,
      this.dawn()!,
    ])
  );

  otherNightsOrder = computed(() =>
    this.prepareNightOrderElements('otherNightsOrder', [
      this.dusk()!,
      this.dawn()!,
    ])
  );

  private prepareNightOrderElements(
    nightOrderField: 'firstNightOrder' | 'otherNightsOrder',
    additionalCards: TemplateRef<unknown>[]
  ) {
    const sortedCharacters = [...this.gameStateService.info().characters]
      .filter(
        (
          character
        ): character is Character & {
          firstNightOrder: number;
          otherNightsOrder: number;
        } => character[nightOrderField] !== null
      )
      .sort((a, b) => a[nightOrderField] - b[nightOrderField]);

    const elementsToRender: NightOrderPosition<{
      firstNightOrder: number;
      otherNightsOrder: number;
    }>[] = [];
    let additionalCardsUsed = 0;
    for (let i = 0; i < sortedCharacters.length; i++) {
      const character = sortedCharacters[i];

      const orderDiff =
        character[nightOrderField] -
        (sortedCharacters[i - 1]?.[nightOrderField] ?? 0);

      if (orderDiff < 1000) {
        elementsToRender.push({
          element: this.nightOrderCharacterCard()!,
          character,
        });
        continue;
      }

      const additionalCardsToAdd = Math.floor(orderDiff / 1000);
      elementsToRender.push(
        ...additionalCards
          .slice(
            additionalCardsUsed,
            additionalCardsUsed + additionalCardsToAdd
          )
          .map(card => ({
            element: card,
          }))
      );

      additionalCardsUsed += additionalCardsToAdd;
    }

    if (additionalCardsUsed < additionalCards.length) {
      elementsToRender.push(
        ...additionalCards.slice(additionalCardsUsed).map(card => ({
          element: card,
        }))
      );
    }

    return elementsToRender;
  }
}
