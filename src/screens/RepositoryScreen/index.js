import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';

const RepositoryScreen = props => {
  return (
    <View style={{ backgroundColor: 'orange', height: '100%' }}>
      <Button
        title='prev'
        onPress={() =>
          Navigation.pop(props.componentId)
        }
      />
    </View>
  );
};

RepositoryScreen.options = {
  topBar: {
    title: {
      text: 'Repository',
      color: 'white',
    },
    background: {
      color: 'blue',
    },
  },
};

export default RepositoryScreen;
