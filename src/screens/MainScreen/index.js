import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Avatar, Icon, Input, ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookmarkRepo,
  setDisplayedRepo,
  fetchPageIfNeeded,
} from '../../actions/repository';
import {
  getBookmarks,
  getLoadedRepositories,
  isFetching,
  hasError,
  getPage
} from '../../selectors';
import { useDebounce } from 'use-debounce/lib';
import style from './style';

const MainScreen = props => {
  const loading = useSelector(isFetching);
  const error = useSelector(hasError);

  return (
    <View style={style.mainView}>
      <SearchInput />
      <RepositoryList />
    </View>
  );
};

MainScreen.options = {
  topBar: {
    title: {
      text: 'Repositories',
      color: 'white',
    },
    background: {
      color: 'blue',
    },
  },
};

export const SearchInput = () => {
  const page = useSelector(getPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 1000);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageIfNeeded(debouncedQuery, page));
  }, [debouncedQuery, page]);

  return (
    <Input
      placeholder='Search'
      value={searchQuery}
      onChangeText={txt => setSearchQuery(txt)}
      rightIcon={<Icon
        name='cancel'
        onPress={() => setSearchQuery('')}
      />}
    />
  );
};

export const RepositoryList = () => {
  const loadedRepos = useSelector(getLoadedRepositories);
  const flattenedList = [].concat.apply([], loadedRepos);
  return (
    <FlatList
      data={flattenedList}
      keyExtractor={repo => `${repo.id}`}
      renderItem={({ item }) =>
        <RepositoryItem item={item} />
      }
    >
    </FlatList>
  );
};

export const RepositoryItem = props => {
  const bookmarks = useSelector(getBookmarks);
  const dispatch = useDispatch();
  const {
    name,
    description,
    stars,
    avatar_url,
  } = props.item;
  return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: avatar_url }} />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{description}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};


export default MainScreen;
