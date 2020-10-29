import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookmarksButton from '..';
import { configureStoreNoLogs } from '../../../../../store';
import { Provider } from 'react-redux';
import { REPO_URL_EXAMPLE_1 } from '../../../../../data_examples/data_examples';

const store = configureStoreNoLogs();

describe('BookmarksButton integration tests', () => {
  test('creates and removes a bookmark', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BookmarksButton url={REPO_URL_EXAMPLE_1} />
      </Provider>
    );

    expect(store.getState().repositoryReducer.bookmarkedURLs).toHaveLength(0);
    const button = getByTestId('BookmarkButton');
    fireEvent.press(button);
    expect(store.getState().repositoryReducer.bookmarkedURLs[0]).toEqual(REPO_URL_EXAMPLE_1);
    fireEvent.press(button);
    expect(store.getState().repositoryReducer.bookmarkedURLs).toHaveLength(0);
  });
});
