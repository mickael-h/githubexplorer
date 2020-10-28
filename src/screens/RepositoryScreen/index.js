import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Avatar, Card, ListItem } from 'react-native-elements';
import Markdown from 'react-native-markdown-display';
import { useSelector } from 'react-redux';
import LanguageLabel from '../../components/LanguageLabel';
import StarCounter from '../../components/StarCounter';
import { getDisplayedRepository } from '../../selectors';
import style from './style';

const RepositoryScreen = () => {
  const {
    name,
    description,
    stars,
    language,
    avatarUrl,
    readme,
    fetchingReadme,
    readmeError,
  } = useSelector(getDisplayedRepository);

  return (
    <ScrollView style={style.mainView}>
      <View style={style.titleCtn}>
        <Avatar source={{ uri: avatarUrl }} size='large' />
        <Text style={style.title}>{name}</Text>
      </View>
      <Card.Divider style={style.divider} />
      <ListItem.Subtitle>{description}</ListItem.Subtitle>
      <View style={style.row}>
        <StarCounter stars={stars} />
        {Boolean(language)
          ? <LanguageLabel language={language} />
          : null
        }
      </View>
      <Card.Divider style={style.divider} />
      {fetchingReadme && !readmeError
        ? <ActivityIndicator animating size='large' color='blue' />
        : null
      }
      {readme == null ? null :
        <Markdown>
          {readme}
        </Markdown>
      }
    </ScrollView>
  );
};

RepositoryScreen.options = {
  topBar: {
    background: {
      color: '#BBBBFF',
    },
  },
};

export default RepositoryScreen;
