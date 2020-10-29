import React from 'react';
import { render } from '@testing-library/react-native';
import FillerMessage from '..';
import { configureStoreNoLogs } from '../../../../../store';
import { Provider } from 'react-redux';

const store = configureStoreNoLogs();

describe('FillerMessage unit tests', () => {
  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <FillerMessage />
      </Provider>
    );
  });
});
