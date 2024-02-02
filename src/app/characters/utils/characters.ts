import { CharacterEdition, CharacterType, Script } from '../../constants';
import { Character } from '../../typings';
import { characters } from '../index';

export const getCharacterById = (id: string) =>
  characters.find(character => character.id === id);

export const getCharacterIdsByType = (type: CharacterType) =>
  characters.filter(character => character.type === type).map(({ id }) => id);

export const getCharactersFromBaseScript = (script: Script) => {
  switch (script) {
    case Script.TROUBLE_BREWING:
      return characters.filter(
        character => character.edition === CharacterEdition.TROUBLE_BREWING
      );
    case Script.SECTS_AND_VIOLETS:
      return characters.filter(
        character => character.edition === CharacterEdition.SECTS_AND_VIOLETS
      );
    case Script.BAD_MOON_RISING:
      return characters.filter(
        character => character.edition === CharacterEdition.BAD_MOON_RISING
      );
    default:
      return characters;
  }
};

export const enrichCharacterInfo = (
  partialCharacters: Partial<Character>[]
): Character[] =>
  partialCharacters
    .map(partialCharacter => {
      const character = characters.find(
        character => character.id === partialCharacter.id
      );
      if (!character) {
        console.warn(`Cannot enrich character: ${partialCharacter.id}`);
        return null;
      }
      return character;
    })
    .filter((character): character is Character => character !== null);
