import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RepositoryItem from '..';
import { configureStoreNoLogs } from '../../../../../store';
import { Provider } from 'react-redux';
import { REPO_EXAMPLE_1 } from '../../../../../data_examples';
import { NavigationProvider } from 'react-native-navigation-hooks/dist';
import { useNavigation } from 'react-native-navigation-hooks';
jest.mock('react-native-navigation-hooks');


const store = configureStoreNoLogs();

describe('RepositoryItem unit tests', () => {
  test('redirects to preview screen', () => {
    const mockPush = jest.fn();
    useNavigation.mockReturnValue({
      push: mockPush,
    });
    const { getByTestId } = render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <RepositoryItem item={REPO_EXAMPLE_1} />
        </Provider>
      </NavigationProvider>
    );

    const item = getByTestId(`RepoItem:${REPO_EXAMPLE_1.name}`);
    fireEvent.press(item);
    expect(mockPush).toHaveBeenCalled();
  });

  test('also renders without a language', () => {
    const repo = { ...REPO_EXAMPLE_1 };
    delete repo.language;
    render(
      <NavigationProvider value={{ componentId: 2 }}>
        <Provider store={store}>
          <RepositoryItem item={repo} />
        </Provider>
      </NavigationProvider>
    );
  });
});
