import React from 'react';
import { View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { LANGUAGE_COLORS } from '../../services/github';
import style from './style';

const LanguageLabel = ({ language }) => {
  return (
    <View testID='LanguageLabel' style={style.mainView}>
      <Icon name='circle' size={18} color={LANGUAGE_COLORS[language]} />
      <ListItem.Subtitle> {language}</ListItem.Subtitle>
    </View>
  );
};

export default LanguageLabel;
