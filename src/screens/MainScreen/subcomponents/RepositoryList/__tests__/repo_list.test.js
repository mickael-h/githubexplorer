import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import RepositoryList from '..';
import { Provider } from 'react-redux';
import fetchMock from 'fetch-mock-jest';
import {
  EMPTY_RAW_PAGE,
  RAW_PAGE_EXAMPLE,
  STATE_WITH_3_LOADED_REPOS,
} from '../../../../../data_examples';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation } from 'react-native-navigation-hooks';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('react-native-navigation-hooks');
jest.mock('react-native-responsive-dimensions');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const PAGE_1_URL =
  'https://api.github.com/search/repositories?page=1&q=stars%3A%3E%3D1000&sort=stars';
const PAGE_2_URL =
  'https://api.github.com/search/repositories?page=2&q=stars%3A%3E%3D1000&sort=stars';

describe('RepositoryList unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  beforeEach(() => {
    responsiveHeight.mockReturnValue(1000);
    useNavigation.mockReturnValue({ push: jest.fn() });
    fetchMock.mock();
    fetchMock.get(
      PAGE_1_URL,
      RAW_PAGE_EXAMPLE,
    );
  });

  test('next page is not called if loading', () => {
    const store = mockStore({
      repositoryReducer: {
        ...STATE_WITH_3_LOADED_REPOS,
        fetching: true,
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <RepositoryList />
      </Provider>
    );

    const list = getByTestId('RepositoryList');
    const eventData = {
      nativeEvent: {
        contentOffset: { y: 500, },
        contentSize: { height: 500, width: 100, },
        layoutMeasurement: { height: 100, width: 100, },
      },
    };
    fireEvent.scroll(list, eventData);
    expect(fetchMock).not.toHaveFetched(PAGE_2_URL);
  });

  test('next page is called on scroll when close to bottom', () => {
    fetchMock.get(
      PAGE_2_URL,
      RAW_PAGE_EXAMPLE,
    );
    const store = mockStore({
      repositoryReducer: STATE_WITH_3_LOADED_REPOS,
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <RepositoryList />
      </Provider>
    );

    const list = getByTestId('RepositoryList');
    const eventData = {
      nativeEvent: {
        contentOffset: { y: 500, },
        contentSize: { height: 2000, width: 100, },
        layoutMeasurement: { height: 1000, width: 300, },
      },
    };
    fireEvent.scroll(list, eventData);
    expect(fetchMock).toHaveFetched(PAGE_2_URL);
  });

  test('next page is not called on scroll when far from bottom', () => {
    fetchMock.get(
      PAGE_2_URL,
      RAW_PAGE_EXAMPLE,
    );
    const store = mockStore({
      repositoryReducer: STATE_WITH_3_LOADED_REPOS,
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <RepositoryList />
      </Provider>
    );

    const list = getByTestId('RepositoryList');
    const eventData = {
      nativeEvent: {
        contentOffset: { y: 500, },
        contentSize: { height: 4000, width: 100, },
        layoutMeasurement: { height: 1000, width: 300, },
      },
    };
    fireEvent.scroll(list, eventData);
    expect(fetchMock).not.toHaveFetched(PAGE_2_URL);
  });
});
