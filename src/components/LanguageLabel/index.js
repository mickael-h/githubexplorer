import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { LANGUAGE_COLORS } from '../../services/github';
import style from './style';

const LanguageLabel = ({ language }) => {
  return (
    <View testID='LanguageLabel' style={style.mainView}>
      <Icon name='circle' size={18} color={LANGUAGE_COLORS[language]} />
      <Text style={style.text}> {language}</Text>
    </View>
  );
};

export default LanguageLabel;
