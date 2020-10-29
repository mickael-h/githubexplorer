import React from 'react';
import { render } from '@testing-library/react-native';
import SearchView from '..';
import fetchMock from 'fetch-mock-jest';
import { configureStoreNoLogs } from '../../../../../store';
import { Provider } from 'react-redux';
import { NavigationProvider } from 'react-native-navigation-hooks/dist';
import { RAW_PAGE_EXAMPLE, STATE_WITH_1_LOADED_REPO } from '../../../../../data_examples/data_examples';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../../../reducers/repositoryReducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// TODO: fix the weird "act" warning

describe('SearchView unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  beforeEach(() => {
    fetchMock.mock();
    fetchMock.get(
      'https://api.github.com/search/repositories?page=1&q=stars%3A%3E%3D1000&sort=stars',
      RAW_PAGE_EXAMPLE,
    );
  });
  test('renders correctly', done => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <SearchView />
        </Provider>
      </NavigationProvider>
    );
    // Because of useDebounce in SearchInput. Mocking doesn't work.
    setTimeout(() => {
      done();
    }, 1100);
  });

  test('renders correctly with error', done => {
    const store = mockStore({
      repositoryReducer: {
        ...initialState,
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
    // Because of useDebounce in SearchInput. Mocking doesn't work.
    setTimeout(() => {
      done();
    }, 1100);
  });
});
