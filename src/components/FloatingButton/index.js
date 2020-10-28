import React from 'react';
import { Icon } from 'react-native-elements';
import style from './style';

const FloatingButton = props => {
  return (
    <Icon
      testID='FloatingButton'
      reverse
      name={props.name}
      color='blue'
      containerStyle={style.buttonPosition}
      onPress={props.onPress}
    />
  );
};

export default FloatingButton;
