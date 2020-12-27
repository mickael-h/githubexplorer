import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchInput from '..';
import { Provider } from 'react-redux';
import fetchMock from 'fetch-mock-jest';
import { configureStoreNoLogs } from '../../../../../store';
import { RAW_PAGE_EXAMPLE } from '../../../../../data_examples';
import { useDebounce } from 'use-debounce/lib';
jest.mock('use-debounce/lib');

const store = configureStoreNoLogs();

describe('SearchInput integration tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });
  beforeEach(() => {
    useDebounce.mockReturnValue(['']);
    fetchMock.mock();
    const SEARCH_ALL_URL =
      'https://api.github.com/search/repositories?page=1&q=stars%3A%3E%3D1000&sort=stars';
    fetchMock.get(
      SEARCH_ALL_URL,
      RAW_PAGE_EXAMPLE,
    );
    const SEARCH_TERMS_URL =
      'https://api.github.com/search/repositories?page=1&q=search_terms&sort=stars';
    fetchMock.get(
      SEARCH_TERMS_URL,
      RAW_PAGE_EXAMPLE,
    );
  });
  test('renders correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <SearchInput />
      </Provider>
    );


    useDebounce.mockReturnValue(['search_terms']);
    const input = getByTestId('SearchInput');
    fireEvent.changeText(input, 'search_terms');
    expect(store.getState().repositoryReducer.query).toEqual('search_terms');

    useDebounce.mockReturnValue(['']);
    const button = getByTestId('EraseSearchButton');
    fireEvent.press(button);
    expect(store.getState().repositoryReducer.query).toEqual('');
  });
});
