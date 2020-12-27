import * as RNLocalize from 'react-native-localize';
import { SET_LANGUAGE } from './types';

export const initLanguage = () => {
  const bestDeviceLanguage = RNLocalize.findBestAvailableLanguage(['fr', 'en']);
  return setLanguage(bestDeviceLanguage?.languageTag);
};

export const setLanguage = locale => {
  let texts;
  switch (locale) {
    case 'fr':
      texts = require('../texts/texts-fr');
      break;
    case 'en':
    default:
      texts = require('../texts/texts-en');
      break;
  }
  return {
    type: SET_LANGUAGE,
    texts,
  };
};
