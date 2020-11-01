import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'react-native-navigation-hooks';
import style from './style';
import { useDispatch } from 'react-redux';
import { setDisplayedRepo } from '../../../../actions/repository';
import StarCounter from '../../../../components/StarCounter';
import LanguageLabel from '../../../../components/LanguageLabel';
import BookmarkButton from '../BookmarkButton';
import FastImage from 'react-native-fast-image';

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

  const previewRepo = useCallback(
    () => {
      dispatch(setDisplayedRepo(item));
      push('RepositoryScreen', null,
        {
          topBar: {
            title: {
              text: name,
            },
          },
        });
    },
    [],
  );

  return (
    <TouchableOpacity
      testID={`RepoItem:${name}`}
      style={style.mainContainer}
      onPress={previewRepo}
    >
      <FastImage
        source={{ uri: avatarUrl }}
        style={style.avatar}
      />
      <View style={style.contentContainer}>
        <Text style={style.title}>{name}</Text>
        <Text
          style={style.subtitle}
          numberOfLines={3}
        >
          {description}
        </Text>
        <View style={style.infoContainer}>
          <StarCounter stars={stars} />
          {Boolean(language)
            ? <LanguageLabel language={language} />
            : null
          }
        </View>
      </View>
      <BookmarkButton
        style={style.bookmarkButton}
        url={url}
      />
    </TouchableOpacity>
  );
};

export default RepositoryItem;
