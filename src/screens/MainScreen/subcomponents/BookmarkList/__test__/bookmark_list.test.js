import React from 'react';
import { render } from '@testing-library/react-native';
import BookmarksList from '..';
import { Provider } from 'react-redux';
import {
  STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED,
} from '../../../../../data_examples/data_examples';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BookmarksList unit tests', () => {
  test('renders correctly', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED });
    render(
      <Provider store={store}>
        <BookmarksList />
      </Provider>
    );
  });
});
