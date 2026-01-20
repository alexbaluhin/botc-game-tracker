import { Point } from '@angular/cdk/drag-drop';
import { CharacterType } from './constants';

export interface GameInformation {
  name?: string;
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
  isDeadVoteUsed?: boolean;
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
  reminderTokens: string[];
  firstNightOrder: number | null;
  firstNightAbilityDesc: string | null;
  otherNightsOrder: number | null;
  otherNightsAbilityDesc: string | null;
  jinxes: CharacterJinx[];
}

export interface ScriptMetaInfo {
  id: '_meta';
  author: string;
  name: string;
  logo: string;
}

export interface ScriptCharacter {
  id: string;
}

export type Script = (ScriptCharacter | ScriptMetaInfo)[];
