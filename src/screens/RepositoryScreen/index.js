import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import FloatingButton from '../../components/FloatingButton';
import LanguageLabel from '../../components/LanguageLabel';
import StarCounter from '../../components/StarCounter';
import { getDisplayedRepository } from '../../selectors';
import share from '../../services/sharing';
import style from './style';
import MarkdownView from './subcomponents/MarkdownView';

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
    <View testID='RepositoryScreen' style={style.mainView}>
      <ScrollView style={style.mainView}>
        <View style={style.titleCtn}>
          <FastImage source={{ uri: avatarUrl }} style={style.avatar} />
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
          ? <ActivityIndicator
            testID='ActivityIndicator'
            animating size='large'
            color='blue'
          />
          : null
        }
        {Boolean(readme)
          ? <MarkdownView content={readme} />
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
