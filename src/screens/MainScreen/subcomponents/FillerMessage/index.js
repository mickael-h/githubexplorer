import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import style from './style';


export const FillerMessage = ({ value, error }) =>
  <View style={style.fillerCtn}>
    {error && <Icon name='error' size={30} color='red' />}
    <Text style={style.fillerMessage}>{value}</Text>
  </View>;

export default FillerMessage;
