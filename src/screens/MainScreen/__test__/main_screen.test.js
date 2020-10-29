import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainScreen from '..';
import fetchMock from 'fetch-mock-jest';
import { configureStoreNoLogs } from '../../../store';
import { Provider } from 'react-redux';
import { NavigationProvider } from 'react-native-navigation-hooks/dist';
import { RAW_PAGE_EXAMPLE } from '../../../data_examples/data_examples';

const store = configureStoreNoLogs();

// TODO: fix the weird "act" warning for SearchView

describe('MainScreen unit tests', () => {
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
  test('renders correctly', async done => {
    const { getByTestId } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <MainScreen />
        </Provider>
      </NavigationProvider>
    );

    let button = getByTestId('FloatingButton');
    const getIconProps = btn => btn.children[0].props.children.props;
    expect(getIconProps(button).name).toEqual('favorite');

    fireEvent.press(button);
    button = getByTestId('FloatingButton');
    expect(getIconProps(button).name).toEqual('search');

    fireEvent.press(button);
    button = getByTestId('FloatingButton');
    expect(getIconProps(button).name).toEqual('favorite');

    // Because of useDebounce in SearchInput
    setTimeout(() => {
      done();
    }, 1100);
  });
});
