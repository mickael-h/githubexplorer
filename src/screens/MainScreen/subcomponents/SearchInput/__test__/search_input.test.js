import React from 'react';
import { render } from '@testing-library/react-native';
import SearchInput from '..';
import { Provider } from 'react-redux';
import fetchMock from 'fetch-mock-jest';
import { configureStoreNoLogs } from '../../../../../store';
import { RAW_PAGE_EXAMPLE } from '../../../../../data_examples/data_examples';

const store = configureStoreNoLogs();

describe('SearchInput unit tests', () => {
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
    render(
      <Provider store={store}>
        <SearchInput />
      </Provider>
    );
    // TODO: find a solution that does not slow down the tests
    // Because of useDebounce
    setTimeout(() => {
      done();
    }, 1100);
  });
});
