import { Point } from '@angular/cdk/drag-drop';
import { CharacterType, CharacterEdition, Script } from './constants';

export interface GameInformation {
  name?: string;
  script?: Script;
  characters: Character[];
  players: Player[];
  reminders: Reminder[];
  gossips: Gossip[];
  version: number;
  states: {
    playersPositionsWereCalculated: boolean;
  };
}

export type Gossip = {
  day: number;
  playerName: string;
  gossip: string;
};

export type Player = {
  name?: string;
  characters: Character[];
  isCurrentViewer?: boolean;
  isDead?: boolean;
  positionInGrimoire: Point;
};

export type Reminder = {
  relatedCharacter: Character;
  text: string;
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
