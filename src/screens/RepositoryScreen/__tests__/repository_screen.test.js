import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RepositoryScreen from '..';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  STATE_WITH_DISPLAYED_REPO,
  STATE_WITH_DISPLAYED_REPO_WITH_README,
} from '../../../data_examples/data_examples';

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.mock('../../../services/sharing', () => jest.fn());

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('RepositoryScreen tests', () => {
  test('renders with readme and share button works', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_DISPLAYED_REPO_WITH_README });
    const { getByTestId } = render(
      <Provider store={store}>
        <RepositoryScreen />
      </Provider>
    );
    const shareBtn = getByTestId('FloatingButton');
    fireEvent.press(shareBtn);
  });

  test('renders with no language and activity indicator', () => {
    const state = {
      ...STATE_WITH_DISPLAYED_REPO,
      displayedRepository: {
        ...STATE_WITH_DISPLAYED_REPO.displayedRepository,
        fetchingReadme: true,
      },
    };
    delete state.displayedRepository.language;

    const store = mockStore({ repositoryReducer: state });
    const { getByTestId } = render(
      <Provider store={store}>
        <RepositoryScreen />
      </Provider>
    );
    const shareBtn = getByTestId('FloatingButton');
    fireEvent.press(shareBtn);
  });
});
