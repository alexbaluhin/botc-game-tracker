export enum CharacterEdition {
  TROUBLE_BREWING = 'TROUBLE_BREWING',
  SECTS_AND_VIOLETS = 'SECTS_AND_VIOLETS',
  BAD_MOON_RISING = 'BAD_MOON_RISING',
  TRAVELLERS = 'TRAVELLERS',
  FABLED = 'FABLED',
  LORIC = 'LORIC',
  EXPERIMENTAL = 'EXPERIMENTAL',
}

export enum CharacterType {
  TOWNSFOLK = 'TOWNSFOLK',
  OUTSIDER = 'OUTSIDER',
  MINION = 'MINION',
  DEMON = 'DEMON',
  TRAVELLER = 'TRAVELLER',
  FABLED = 'FABLED',
  LORIC = 'LORIC',
}

export const characterTypeName = {
  [CharacterType.TOWNSFOLK]: 'Townsfolks',
  [CharacterType.OUTSIDER]: 'Outsiders',
  [CharacterType.MINION]: 'Minions',
  [CharacterType.DEMON]: 'Demons',
  [CharacterType.TRAVELLER]: 'Travellers',
  [CharacterType.FABLED]: 'Fabled',
  [CharacterType.LORIC]: 'Loric',
};

export enum Script {
  TROUBLE_BREWING = 'TROUBLE_BREWING',
  SECTS_AND_VIOLETS = 'SECTS_AND_VIOLETS',
  BAD_MOON_RISING = 'BAD_MOON_RISING',
  CUSTOM = 'CUSTOM',
}

export const scriptName = {
  [Script.TROUBLE_BREWING]: 'Trouble Brewing',
  [Script.SECTS_AND_VIOLETS]: 'Sects and Violets',
  [Script.BAD_MOON_RISING]: 'Bad Moon Rising',
};

export const charactersCountBasedOnPlayersCount: {
  [count in number]: {
    [type in Exclude<CharacterType, 'FABLED' | 'TRAVELLER' | 'LORIC'>]: number;
  };
} = {
  5: {
    [CharacterType.TOWNSFOLK]: 3,
    [CharacterType.OUTSIDER]: 0,
    [CharacterType.MINION]: 1,
    [CharacterType.DEMON]: 1,
  },
  6: {
    [CharacterType.TOWNSFOLK]: 3,
    [CharacterType.OUTSIDER]: 1,
    [CharacterType.MINION]: 1,
    [CharacterType.DEMON]: 1,
  },
  7: {
    [CharacterType.TOWNSFOLK]: 5,
    [CharacterType.OUTSIDER]: 0,
    [CharacterType.MINION]: 1,
    [CharacterType.DEMON]: 1,
  },
  8: {
    [CharacterType.TOWNSFOLK]: 5,
    [CharacterType.OUTSIDER]: 1,
    [CharacterType.MINION]: 1,
    [CharacterType.DEMON]: 1,
  },
  9: {
    [CharacterType.TOWNSFOLK]: 5,
    [CharacterType.OUTSIDER]: 2,
    [CharacterType.MINION]: 1,
    [CharacterType.DEMON]: 1,
  },
  10: {
    [CharacterType.TOWNSFOLK]: 7,
    [CharacterType.OUTSIDER]: 0,
    [CharacterType.MINION]: 2,
    [CharacterType.DEMON]: 1,
  },
  11: {
    [CharacterType.TOWNSFOLK]: 7,
    [CharacterType.OUTSIDER]: 1,
    [CharacterType.MINION]: 2,
    [CharacterType.DEMON]: 1,
  },
  12: {
    [CharacterType.TOWNSFOLK]: 7,
    [CharacterType.OUTSIDER]: 2,
    [CharacterType.MINION]: 2,
    [CharacterType.DEMON]: 1,
  },
  13: {
    [CharacterType.TOWNSFOLK]: 9,
    [CharacterType.OUTSIDER]: 0,
    [CharacterType.MINION]: 3,
    [CharacterType.DEMON]: 1,
  },
  14: {
    [CharacterType.TOWNSFOLK]: 9,
    [CharacterType.OUTSIDER]: 1,
    [CharacterType.MINION]: 3,
    [CharacterType.DEMON]: 1,
  },
  15: {
    [CharacterType.TOWNSFOLK]: 9,
    [CharacterType.OUTSIDER]: 2,
    [CharacterType.MINION]: 3,
    [CharacterType.DEMON]: 1,
  },
};

export const maxNumberOfPlayersInBaseSetup = +Object.keys(
  charactersCountBasedOnPlayersCount
).at(-1)!;
export const maxNumberOfTravellers = 5;

export const smallestTokenSize = 62;
export const smallestReminderTokenSize = 40;
