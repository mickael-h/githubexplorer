import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { STAR_COLOR } from '../../services/github';
import style from './style';

const StarCounter = ({ stars }) => {
  const starCount = stars < 1000
    ? `${stars}`
    : `${Math.floor(stars / 1000)}k`;

  return (
    <View style={style.mainView}>
      <Icon name='star' size={18} color={STAR_COLOR} />
      <Text style={style.text}> {starCount}</Text>
    </View>
  );
};

export default StarCounter;
