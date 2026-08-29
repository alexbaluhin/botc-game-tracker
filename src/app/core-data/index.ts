import { Character, Script } from '../shared/types/common';
import charactersJson from './characters.json';
import scriptsJson from './scripts.json';

export const characters = charactersJson as Character[];
export const scripts = scriptsJson as Script[];
