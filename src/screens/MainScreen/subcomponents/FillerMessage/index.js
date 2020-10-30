import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import style from './style';


export const FillerMessage = ({ value, error, errorMessage }) =>
  <View style={style.fillerCtn}>
    {error && <Icon name='error' size={30} color='red' />}
    <Text style={style.fillerMessage}>{value}</Text>
    {error && <Text style={style.fillerMessage}>{`${errorMessage}`}</Text>}
  </View>;

export default FillerMessage;
