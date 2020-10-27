import React from 'react';
import configureStore from '../../store';
import { Provider } from 'react-redux';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

const store = configureStore();
const ScreenWrapper = ({ children }) =>
  <Provider store={store}>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView style={StyleSheet.absoluteFill}>
      {children}
    </SafeAreaView>
  </Provider>;

export default ScreenWrapper;
