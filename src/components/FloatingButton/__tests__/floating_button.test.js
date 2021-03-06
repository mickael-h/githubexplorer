import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FloatingButton from '..';

describe('FloatingButton unit tests', () => {
  test('When I press the button, the callback is called', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<FloatingButton
      name='add'
      onPress={callback}
    />);
    fireEvent.press(getByTestId('FloatingButton'));
    expect(callback).toHaveBeenCalled();
  });
});
