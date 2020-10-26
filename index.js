import React from 'react';
import { Navigation } from 'react-native-navigation';
import MainScreen from './src/screens/MainScreen';
import RepositoryScreen from './src/screens/RepositoryScreen';
import initStore from './src/store';
import { Provider } from 'react-redux';
import { SafeAreaView, StatusBar } from 'react-native';

const store = initStore();
const Wrapper = ({ children }) =>
  <Provider store={store}>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      {children}
    </SafeAreaView>
  </Provider>;

Navigation.registerComponent(
  'MainScreen',
  () => props => <Wrapper><MainScreen {...props} /></Wrapper>,
  () => MainScreen
);

Navigation.registerComponent(
  'RepositoryScreen',
  () => props => <Wrapper><RepositoryScreen {...props} /></Wrapper>,
  () => RepositoryScreen
);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'MainScreen',
            },
          },
        ],
      },
    },
  });
});
