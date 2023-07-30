import { CharacterType, Edition } from './constants';

export interface CharacterJinx {
  id: string;
  desc: string;
}

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  abilityDesc: string;
  edition: Edition;
  reminderTokens: string[];
  firstNightOrder: number | null;
  firstNightAbilityDesc: string | null;
  otherNightsOrder: number | null;
  otherNightsAbilityDesc: string | null;
  jinxes: CharacterJinx[];
  specialSetupChanges: boolean;
}
