import React from 'react';
import { render } from '@testing-library/react-native';
import BookmarksView from '..';
import { Provider } from 'react-redux';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  REPO_EXAMPLE_1,
  STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED,
  INITIAL_STATE,
} from '../../../../../data_examples';
import { NavigationProvider } from 'react-native-navigation-hooks/dist';
import texts from '../../../../../texts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BookmarksView unit tests', () => {

  test('renders bookmarks correctly', () => {
    const store = mockStore(STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED);
    const { queryByText } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <BookmarksView />
        </Provider>
      </NavigationProvider>
    );

    expect(queryByText(REPO_EXAMPLE_1.name)).not.toBeNull();
  });

  test('renders no bookmarks message correctly', () => {
    const store = mockStore(INITIAL_STATE);
    const { queryByText } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <BookmarksView />
        </Provider>
      </NavigationProvider>
    );

    expect(queryByText(texts.no_bookmarks)).not.toBeNull();
  });

  test('renders bookmarks error message correctly', () => {
    const store = mockStore({
      ...INITIAL_STATE,
      bookmarkReducer: {
        ...INITIAL_STATE.bookmarkReducer,
        error: 'some error',
      },
    });
    const { queryByText } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <BookmarksView />
        </Provider>
      </NavigationProvider>
    );

    expect(queryByText(texts.bookmarks_error)).not.toBeNull();
  });

  test('renders loading indicator correctly', () => {
    const store = mockStore({
      ...INITIAL_STATE,
      bookmarkReducer: {
        ...INITIAL_STATE.bookmarkReducer,
        fetching: true,
      },
    });
    const { queryByTestId } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <BookmarksView />
        </Provider>
      </NavigationProvider>
    );

    expect(queryByTestId('BookmarkLoading')).not.toBeNull();
  });
});
