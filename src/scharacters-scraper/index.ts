import fs from 'fs';
import path from 'path';
import { chromium, Page, Response as PlaywrightResponse } from 'playwright';
import { CharacterType, Edition } from '../app/constants';
import { Character } from '../app/typings';

interface WikiRoleSpecial {
  name: 'grimoire' | 'pointing' | 'distribute-roles';
  type: 'signal' | 'ability';
  time: 'day' | 'night' | 'pregame';
  global: 'minion';
}

interface WikiCharacterJinx {
  id: string;
  reason: string;
}

interface WikiCharacter {
  id: string;
  name: string;
  ability: string;
  edition?: string;
  team?: string;
  firstNight?: number;
  firstNightReminder?: string;
  otherNight?: number;
  otherNightReminder?: string;
  reminders?: string[];
  remindersGlobal?: string[];
  setup?: boolean;
  special?: WikiRoleSpecial[];
  jinxes?: WikiCharacterJinx[];
}

const wikiEditionToEdition: { [key: string]: Edition } = {
  tb: Edition.TROUBLE_BREWING,
  snv: Edition.SECTS_AND_VIOLETS,
  bmr: Edition.BAD_MOON_RISING,
  '': Edition.EXPERIMENTAL,
  fabled: Edition.FABLED,
  traveler: Edition.TRAVELLERS,
};

const wikiCharacterTypeToType: { [key: string]: CharacterType } = {
  townsfolk: CharacterType.TOWNSFOLK,
  outsider: CharacterType.OUTSIDER,
  minion: CharacterType.MINION,
  demon: CharacterType.DEMON,
};

const baseUrl = 'https://wiki.bloodontheclocktower.com';
const assetsIconsDir = path.resolve(process.cwd(), 'src', 'assets', 'icons');
const appDir = path.resolve(process.cwd(), 'src', 'app');

const waitForResponse = (
  page: Page,
  requestUrlFn: (url: string) => boolean
) => {
  return new Promise<PlaywrightResponse | null>(resolve => {
    page.on('response', response => {
      if (requestUrlFn(response.url())) {
        return resolve(response);
      }
    });
    return setTimeout(() => resolve(null), 10_000);
  });
};

const downloadCharacterIcon = async (
  wikiCharacter: WikiCharacter,
  page: Page
) => {
  await page.goto(`${baseUrl}/${wikiCharacter.name}`);
  const el = await page.$('#character-details .image:first-child img');
  const pathToIcon = await el?.getAttribute('src');
  if (!pathToIcon) {
    console.error('Cannot get info about ' + wikiCharacter.name);
    return null;
  }
  const roleIconResponse = await fetch(`${baseUrl}${pathToIcon}`);
  fs.writeFileSync(
    `${assetsIconsDir}/${wikiCharacter.id}.png`,
    Buffer.from(await roleIconResponse.arrayBuffer())
  );
  return true;
};

const mapWikiCharacterToCharacter = (
  wikiCharacter: WikiCharacter
): Character => {
  return {
    id: wikiCharacter.id,
    name: wikiCharacter.name,
    type: wikiCharacterTypeToType[wikiCharacter.team ?? 'townsfolk'],
    abilityDesc: wikiCharacter.ability,
    edition: wikiEditionToEdition[wikiCharacter.edition ?? ''],
    reminderTokens: [
      ...(wikiCharacter.reminders ?? []),
      ...(wikiCharacter.remindersGlobal ?? []),
    ],
    firstNightOrder: wikiCharacter.firstNight || null,
    firstNightAbilityDesc: wikiCharacter.firstNightReminder ?? null,
    otherNightsOrder: wikiCharacter.otherNight || null,
    otherNightsAbilityDesc: wikiCharacter.otherNightReminder ?? null,
    jinxes: (wikiCharacter.jinxes ?? []).map(jinx => ({
      id: jinx.id,
      desc: jinx.reason,
    })),
    specialSetupChanges: wikiCharacter.setup ?? false,
  };
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const rolesResponsePromise = waitForResponse(page, url =>
    url.endsWith('/roles.json')
  );
  await page.goto(baseUrl);
  const rolesResponse = await rolesResponsePromise;
  if (!rolesResponse) {
    console.error('Cannot get roles.json');
    return;
  }
  const characters: WikiCharacter[] = await rolesResponse.json();
  const preparedCharacters: Character[] = [];
  for (let i = 0; i < characters.length; i++) {
    await downloadCharacterIcon(characters[i], page);
    preparedCharacters.push(mapWikiCharacterToCharacter(characters[i]));
  }
  await fs.writeFileSync(
    `${appDir}/characters.json`,
    JSON.stringify(preparedCharacters)
  );
  await context.close();
  process.exit(0);
})();
