import React from 'react';
import { Navigation } from 'react-native-navigation';
import ScreenWrapper from './src/components/ScreenWrapper';
import MainScreen from './src/screens/MainScreen';
import RepositoryScreen from './src/screens/RepositoryScreen';

Navigation.registerComponent(
  'MainScreen',
  () =>
    props =>
      <ScreenWrapper componentId={props.componentId}>
        <MainScreen {...props} />
      </ScreenWrapper>,
  () => MainScreen
);

Navigation.registerComponent(
  'RepositoryScreen',
  () =>
    props =>
      <ScreenWrapper componentId={props.componentId}>
        <RepositoryScreen {...props} />
      </ScreenWrapper>,
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
