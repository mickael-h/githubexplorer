import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { Avatar, Icon, Input, ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookmarkRepo,
  setDisplayedRepo,
  fetchBookmarksIfNeeded,
  fetchPageIfNeeded,
  removeBookmark,
} from '../../actions/repository';
import {
  getBookmarkedURLs,
  getBookmarkedRepositories,
  getLoadedRepositories,
  isFetching,
  hasError,
  getPage,
  getQuery,
} from '../../selectors';
import { useDebounce } from 'use-debounce/lib';
import style from './style';
import { LANGUAGE_COLORS, STAR_COLOR } from '../../services/github';
import FloatingButton from '../../components/FloatingButton';

const MainScreen = () => {
  const dispatch = useDispatch();
  const [filterBookmarks, setFilterBookmarks] = useState(false);

  const toggleFilter = () => {
    const willFilter = !filterBookmarks;
    setFilterBookmarks(willFilter);
    if (willFilter) {
      dispatch(fetchBookmarksIfNeeded());
    }
  };

  return filterBookmarks ?
    <BookmarksView toggleFilter={toggleFilter} /> :
    <SearchView toggleFilter={toggleFilter} />;
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

export const SearchView = ({ toggleFilter }) => {
  const loadedRepos = useSelector(getLoadedRepositories);
  const loading = useSelector(isFetching);
  const error = useSelector(hasError);
  const showLoading = loading && loadedRepos.length == 0;
  const showError = error && !loading && loadedRepos.length == 0;
  return (
    <View style={style.mainView}>
      <SearchInput />
      {showLoading
        ? <ActivityIndicator animating size='large' color='blue' />
        : null
      }
      {showError // TODO: a better error feedback
        ? <Icon name='error' size={30} color='red' />
        : null
      }
      <RepositoryList />
      <FloatingButton name={'favorite'} onPress={toggleFilter} />
    </View>
  );
};

export const BookmarksView = ({ toggleFilter }) => {
  return (
    <View style={style.mainView}>
      <BookmarkList />
      <FloatingButton name={'search'} onPress={toggleFilter} />
    </View>
  );
};

export const SearchInput = () => {
  const page = useSelector(getPage);
  const query = useSelector(getQuery);
  const [searchQuery, setSearchQuery] = useState(query);
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
        disabled={!Boolean(searchQuery)}
        disabledStyle={style.hiddenButton}
        name='cancel'
        onPress={() => setSearchQuery('')}
      />}
    />
  );
};

// TODO: implement pull to refresh
export const BookmarkList = () => {
  const bookmarks = useSelector(getBookmarkedRepositories);
  const dispatch = useDispatch();
  return (
    <FlatList
      data={bookmarks}
      keyExtractor={repo => repo.url}
      renderItem={({ item }) =>
        <RepositoryItem item={item} />
      }
    >
    </FlatList>
  );
};

//TODO: implement pull to refresh
export const RepositoryList = () => {
  const loadedRepos = useSelector(getLoadedRepositories);
  const flattenedList = [].concat.apply([], loadedRepos);
  return (
    <FlatList
      data={flattenedList}
      keyExtractor={repo => repo.url}
      renderItem={({ item }) =>
        <RepositoryItem item={item} />
      }
    >
    </FlatList>
  );
};

export const RepositoryItem = ({ item }) => {
  const {
    url,
    name,
    description,
    stars,
    language,
    avatarUrl,
  } = item;

  const starCount = stars < 1000
    ? `${stars}`
    : `${Math.floor(stars / 1000)}k`;

  return (
    <ListItem bottomDivider>
      <Avatar source={{ uri: avatarUrl }} />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
        <ListItem.Subtitle>{description}</ListItem.Subtitle>
        <View style={style.repoItemInfoContainer}>
          <View style={style.repoItemInfoView}>
            <Icon name='star' size={18} color={STAR_COLOR} />
            <ListItem.Subtitle> {starCount}</ListItem.Subtitle>
          </View>
          {Boolean(language)
            ? <View style={style.repoItemInfoView}>
              <Icon name='circle' size={18} color={LANGUAGE_COLORS[language]} />
              <ListItem.Subtitle> {language}</ListItem.Subtitle>
            </View>
            : null
          }
        </View>
      </ListItem.Content>
      <BookmarkButton url={url} />
    </ListItem>
  );
};

export const BookmarkButton = ({ url }) => {
  const bookmarks = useSelector(getBookmarkedURLs);
  const dispatch = useDispatch();
  const isBookmarked = bookmarks.includes(url);

  const toggleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(url));
    } else {
      dispatch(bookmarkRepo(url));
    }
  };

  return (
    <Icon
      name={isBookmarked ? 'favorite' : 'favorite-outline'}
      color='red'
      size={30}
      onPress={toggleBookmark}
    />
  );
};

export default MainScreen;
