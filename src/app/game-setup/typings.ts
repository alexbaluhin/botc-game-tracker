import { CharacterType } from '../constants';
import { Character } from '../typings';

export interface CharacterForSelection extends Character {
  selected?: boolean;
}

export type CharactersCategory = {
  name: string;
  type: CharacterType;
  characters: CharacterForSelection[];
  selectedCount: number;
  maxCounts?: [number, number];
  isFilled: boolean;
};

export type MaxCountsDataForSetupChange = {
  [type in Exclude<CharacterType, 'TRAVELLER' | 'FABLED'>]: [number, number];
};

export interface DataForSetupChange {
  characters: CharacterForSelection[];
  maxCounts: MaxCountsDataForSetupChange;
}

export type CharactersSetupChanges = {
  [id in string]: (
    dataForSetupChange: DataForSetupChange
  ) => DataForSetupChange;
};

export type ScriptForSelection = {
  name: string;
  logo?: string;
  characters: Character[];
};
