import React from 'react';
import { View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useNavigation } from 'react-native-navigation-hooks';
import style from './style';
import { useDispatch } from 'react-redux';
import { setDisplayedRepo } from '../../../../actions/repository';
import StarCounter from '../../../../components/StarCounter';
import LanguageLabel from '../../../../components/LanguageLabel';
import BookmarkButton from '../BookmarkButton';

const RepositoryItem = ({ item }) => {
  const { push } = useNavigation();
  const dispatch = useDispatch();
  const {
    url,
    name,
    description,
    stars,
    language,
    avatarUrl,
  } = item;

  const previewRepo = () => {
    dispatch(setDisplayedRepo(item));
    push('RepositoryScreen', null,
      {
        topBar: {
          title: {
            text: name,
          },
        },
      });
  };

  return (
    <ListItem
      testID={`RepoItem:${name}`}
      bottomDivider
      onPress={previewRepo}
    >
      <Avatar source={{ uri: avatarUrl }} />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{description}</ListItem.Subtitle>
        <View style={style.repoItemInfoContainer}>
          <StarCounter stars={stars} />
          {Boolean(language)
            ? <LanguageLabel language={language} />
            : null
          }
        </View>
      </ListItem.Content>
      <BookmarkButton url={url} />
    </ListItem>
  );
};

export default RepositoryItem;
