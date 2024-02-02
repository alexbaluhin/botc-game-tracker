import { CharacterType } from '../constants';
import { CharactersSetupChanges } from './typings';

//// drunk + 1 townsfolk
//// baron + 2 outsider
//// godfather +- 1 outsider
//// fanggu + 1 outsider
//// vigormortis - 1 outsider
//// bountyhunter 1 townsfolk is evil
//// balloonist + 1 outsider
//// huntsman + damsel
//// choirboy + king
//// atheist 0 minions and demons (no evil characters)
//// marionette demon is neighbour
//// lilmonsta + 1 minion
//// legion most players are legion
//// riot all minions are riot
//// sentinel +- 1 outsider

// spy-damsel only 1
// spy-heretic only 1
// baron-heretic + 1-2 outsider
// godfather-heretic only 1
// widow-heretic only 1
// widow-damsel only 1
// lilmonsta-magician only 1
// alhadikhia-mastermind only 1
// legion-engineer only 1
// legion-preacher only 1
// riot-engineer only 1
// riot-exorcist only 1
// riot-minstrel only 1
// riot-flowergirl only 1
// organgrinder-minstrel only 1
// organgrinder-preacher only 1

export const charactersSetupChanges: CharactersSetupChanges = {
  drunk: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.TOWNSFOLK]: [
        maxCounts.TOWNSFOLK[0] + 1,
        maxCounts.TOWNSFOLK[1] + 1,
      ],
    },
  }),
  baron: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.OUTSIDER]: [
        maxCounts.OUTSIDER[0] + 2,
        maxCounts.OUTSIDER[1] + 2,
      ],
    },
  }),
  godfather: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.OUTSIDER]: [
        maxCounts.OUTSIDER[0] - 1,
        maxCounts.OUTSIDER[1] + 1,
      ],
    },
  }),
  fanggu: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.OUTSIDER]: [
        maxCounts.OUTSIDER[0] + 1,
        maxCounts.OUTSIDER[1] + 1,
      ],
    },
  }),
  vigormortis: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.OUTSIDER]: [
        maxCounts.OUTSIDER[0] - 1,
        maxCounts.OUTSIDER[1] - 1,
      ],
    },
  }),
  balloonist: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.OUTSIDER]: [
        maxCounts.OUTSIDER[0] + 1,
        maxCounts.OUTSIDER[1] + 1,
      ],
    },
  }),
  huntsman: ({ characters, ...rest }) => ({
    ...rest,
    characters: characters.map(character => {
      if (character.id === 'damsel') {
        return { ...character, selected: true };
      }

      return character;
    }),
  }),
  choirboy: ({ characters, ...rest }) => ({
    ...rest,
    characters: characters.map(character => {
      if (character.id === 'king') {
        return { ...character, selected: true };
      }

      return character;
    }),
  }),
  atheist: ({ characters, maxCounts }) => ({
    characters: characters.map(character => {
      if (
        [CharacterType.MINION, CharacterType.DEMON].includes(character.type)
      ) {
        return { ...character, selected: false };
      }

      return character;
    }),
    maxCounts: {
      ...maxCounts,
      [CharacterType.MINION]: [0, 0],
      [CharacterType.DEMON]: [0, 0],
    },
  }),
  lilmonsta: ({ maxCounts, ...rest }) => ({
    ...rest,
    maxCounts: {
      ...maxCounts,
      [CharacterType.MINION]: [
        maxCounts.MINION[0] + 1,
        maxCounts.MINION[1] + 1,
      ],
    },
  }),
  riot: ({ characters, maxCounts }) => ({
    characters: characters.map(character => {
      if (character.type === CharacterType.MINION) {
        return { ...character, selected: false };
      }

      return character;
    }),
    maxCounts: {
      ...maxCounts,
      [CharacterType.MINION]: [0, 0],
    },
  }),
};
