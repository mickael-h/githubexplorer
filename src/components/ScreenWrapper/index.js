import React from 'react';
import { configureStoreNoLogs } from '../../store';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationProvider } from 'react-native-navigation-hooks';

const store = configureStoreNoLogs();
const ScreenWrapper = props =>
  <NavigationProvider value={{ componentId: props.componentId }}>
    <ReduxProvider store={store}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={StyleSheet.absoluteFill}>
        {props.children}
      </SafeAreaView>
    </ReduxProvider>
  </NavigationProvider>;

export default ScreenWrapper;
