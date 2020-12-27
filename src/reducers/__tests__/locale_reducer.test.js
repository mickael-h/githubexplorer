import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import localeReducer, { initialState } from '../localeReducer';
import {
  initLanguage,
  setLanguage,
} from '../../actions/localeActions';

const texts_fr = require('../../texts/texts-fr');
const texts_en = require('../../texts/texts-en');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sync unit tests', () => {
  test('set language', () => {
    let newState = localeReducer(
      initialState,
      setLanguage('fr')
    );
    expect(newState.texts).toEqual(texts_fr);

    newState = localeReducer(
      initialState,
      setLanguage('en')
    );
    expect(newState.texts).toEqual(texts_en);
  });

  test('init language', () => {
    const newState = localeReducer(
      initialState,
      initLanguage()
    );
    expect(newState.texts).toEqual(texts_fr);
  });
});
