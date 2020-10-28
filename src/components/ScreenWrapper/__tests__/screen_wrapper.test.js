import React from 'react';
import { render } from '@testing-library/react-native';
import ScreenWrapper from '..';
import { View } from 'react-native';

describe('ScreenWrapper unit tests', () => {
  test('Renders correctly', () => {
    render(
      <ScreenWrapper componentId={2}>
        <View />
      </ScreenWrapper>
    );
  });
});
