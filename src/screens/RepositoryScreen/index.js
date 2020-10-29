import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Avatar, Card, ListItem } from 'react-native-elements';
import Markdown from 'react-native-markdown-display';
import { useSelector } from 'react-redux';
import FloatingButton from '../../components/FloatingButton';
import LanguageLabel from '../../components/LanguageLabel';
import StarCounter from '../../components/StarCounter';
import { getDisplayedRepository } from '../../selectors';
import share from '../../services/sharing';
import style from './style';

const RepositoryScreen = () => {
  const {
    htmlUrl,
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
    <View style={style.mainView}>
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
        {Boolean(readme)
          ? <Markdown>{readme}</Markdown>
          : null
        }
      </ScrollView>
      <FloatingButton name='share' onPress={() => share(htmlUrl)} />
    </View>
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
