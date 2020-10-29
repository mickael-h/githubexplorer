import React from 'react';
import { render } from '@testing-library/react-native';

import { RepositoryScreen } from '..';

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

describe('<RepositoryScreen />', () => {
  render(<RepositoryScreen />);

  test('render', () => {

  });
});
