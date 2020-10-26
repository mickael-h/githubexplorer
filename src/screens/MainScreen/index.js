import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';

const MainScreen = props => {
  const state = useSelector(st => st.reducer);
  const dispatch = useDispatch();
  return (
    <View style={{ backgroundColor: 'red', height: '100%' }}>
      <Button
        title='next'
        onPress={() =>
          Navigation.push(props.componentId, {
            component: {
              name: 'RepositoryScreen',
            },
          })
        }
      />
    </View>
  );
};

export default MainScreen;
