import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RepositoryScreen from '..';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  STATE_WITH_DISPLAYED_REPO,
  STATE_WITH_DISPLAYED_REPO_WITH_README,
} from '../../../data_examples';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('RepositoryScreen tests', () => {
  test('renders with readme and share button works', () => {
    const store = mockStore(STATE_WITH_DISPLAYED_REPO_WITH_README);
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <RepositoryScreen />
      </Provider>
    );

    expect(queryByTestId('ActivityIndicator')).toBeNull();
    expect(queryByTestId('LanguageLabel')).not.toBeNull();
    expect(queryByTestId('Markdown')).not.toBeNull();

    const shareBtn = getByTestId('FloatingButton');
    fireEvent.press(shareBtn);
  });

  test('renders with no language and activity indicator', () => {
    const state = {
      ...STATE_WITH_DISPLAYED_REPO,
      repositoryReducer: {
        ...STATE_WITH_DISPLAYED_REPO.repositoryReducer,
        displayedRepository: {
          ...STATE_WITH_DISPLAYED_REPO.repositoryReducer.displayedRepository,
          fetchingReadme: true,
        },
      },
    };
    delete state.repositoryReducer.displayedRepository.language;

    const store = mockStore(state);
    const { getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <RepositoryScreen />
      </Provider>
    );

    expect(queryByTestId('ActivityIndicator')).not.toBeNull();
    expect(queryByTestId('LanguageLabel')).toBeNull();
    expect(queryByTestId('Markdown')).toBeNull();

    const shareBtn = getByTestId('FloatingButton');
    fireEvent.press(shareBtn);
  });
});
