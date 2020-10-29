import React from 'react';
import { render } from '@testing-library/react-native';
import RepositoryList from '..';
import { Provider } from 'react-redux';
import fetchMock from 'fetch-mock-jest';
import { configureStoreNoLogs } from '../../../../../store';
import { RAW_PAGE_EXAMPLE } from '../../../../../data_examples/data_examples';

const store = configureStoreNoLogs();

describe('RepositoryList unit tests', () => {
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
  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <RepositoryList />
      </Provider>
    );
  });
});
