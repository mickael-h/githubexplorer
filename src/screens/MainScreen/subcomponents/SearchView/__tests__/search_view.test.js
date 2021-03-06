import React from 'react';
import { render } from '@testing-library/react-native';
import SearchView from '..';
import fetchMock from 'fetch-mock-jest';
import { Provider } from 'react-redux';
import { NavigationProvider } from 'react-native-navigation-hooks/dist';
import {
  RAW_PAGE_EXAMPLE,
  STATE_WITH_1_LOADED_REPO,
  INITIAL_STATE,
} from '../../../../../data_examples';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('SearchView unit tests', () => {

  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    fetchMock.mock();
    fetchMock.get(
      'https://api.github.com/search/repositories?page=1&q=stars%3A%3E%3D1000&sort=stars',
      RAW_PAGE_EXAMPLE,
    );
  });

  test('renders correctly', () => {
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
    render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <SearchView />
        </Provider>
      </NavigationProvider>
    );
  });

  test('renders correctly with error', () => {
    const store = mockStore({
      ...INITIAL_STATE,
      repositoryReducer: {
        ...INITIAL_STATE.repositoryReducer,
        error: 'some error',
      },
    });
    render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <SearchView />
        </Provider>
      </NavigationProvider>
    );
  });
});
