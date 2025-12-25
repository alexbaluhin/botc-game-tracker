import { Point } from '@angular/cdk/drag-drop';
import { CharacterType, CharacterEdition } from './constants';

export type Player = {
  name?: string;
  characters: Character[];
  isCurrentViewer?: boolean;
  isDead?: boolean;
  positionInGrimoire: Point;
};

export interface CharacterJinx {
  id: string;
  desc: string;
}

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  abilityDesc: string;
  edition: CharacterEdition;
  reminderTokens: string[];
  firstNightOrder: number | null;
  firstNightAbilityDesc: string | null;
  otherNightsOrder: number | null;
  otherNightsAbilityDesc: string | null;
  jinxes: CharacterJinx[];
  specialSetupChanges: boolean;
}

export interface CustomScriptJsonMetaItem {
  id: '_meta';
  author: string;
  name: string;
}

export interface CustomScriptJsonItem {
  id: string;
}

export type CustomScriptJson = (
  | CustomScriptJsonItem
  | CustomScriptJsonMetaItem
)[];
