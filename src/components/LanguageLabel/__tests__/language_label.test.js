import React from 'react';
import { render } from '@testing-library/react-native';
import LanguageLabel from '..';

describe('LanguageLabel unit tests', () => {
  test('Renders correctly', () => {
    render(<LanguageLabel
      language='JavaScript'
    />);
  });
});
