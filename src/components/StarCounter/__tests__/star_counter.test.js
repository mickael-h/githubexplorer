import React from 'react';
import { render } from '@testing-library/react-native';
import StarCounter from '..';

describe('StarCounter unit tests', () => {
  test('Renders correctly with more than 1000 stars', () => {
    const { getByText } = render(<StarCounter
      stars={350000}
    />);
    getByText(' 350k');
  });

  test('Renders correctly with less than 1000 stars', () => {
    const { getByText } = render(<StarCounter
      stars={800}
    />);
    getByText(' 800');
  });
});
