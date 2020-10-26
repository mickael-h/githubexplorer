import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';

const RepositoryScreen = props => {
  const state = useSelector(st => st.reducer);
  const dispatch = useDispatch();
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

export default RepositoryScreen;
