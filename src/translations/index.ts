import * as path from 'path';
import * as glob from 'glob';
import { messages as es } from './es';

export const defaultMessagesList = es;
export const ALLOWED_LANGUAGES = ['es', 'en'];
export const DEFAULT_LANGUAGE = 'es';

export namespace Server {
  // Languages for which messages are defined under this dir are acceptable
  export const acceptableLanguages = glob.sync(`${__dirname}/*.js`)
    .map((file) => path.basename(file, '.js'))
    .filter((language) => language !== 'index');

  // require messages for each language and cache
  const map = acceptableLanguages.reduce((acc, language) => {
    acc[language] = require(`./${language}`).messages;
    return acc;
  }, {} as {});

  /**
   * Returns a messages object for the specified language
   */
  export function messagesOf(language: string): any {
    return map[language];
  }
}