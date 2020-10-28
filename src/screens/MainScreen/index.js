import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, View } from 'react-native';
import { Avatar, Icon, Input, ListItem } from 'react-native-elements';
import { useNavigation } from 'react-native-navigation-hooks';
import { useDebounce } from 'use-debounce/lib';
import style from './style';
import FloatingButton from '../../components/FloatingButton';
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
  isFetchingSearch,
  isFetchingBookmarks,
  hasBookmarksError,
  hasSearchError,
  getPage,
  getQuery,
} from '../../selectors';
import StarCounter from '../../components/StarCounter';
import LanguageLabel from '../../components/LanguageLabel';

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
    },
    background: {
      color: '#BBBBFF',
    },
  },
};

export const SearchView = ({ toggleFilter }) => {
  const loadedRepos = useSelector(getLoadedRepositories);
  const loading = useSelector(isFetchingSearch);
  const error = useSelector(hasSearchError);
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

//TODO add a nice message when bookmarks are empty
export const BookmarksView = ({ toggleFilter }) => {
  const loading = useSelector(isFetchingBookmarks);
  const error = useSelector(hasBookmarksError);
  return (
    <View style={style.mainView}>
      <BookmarkList />
      {loading
        ? <ActivityIndicator animating size='large' color='blue' />
        : null
      }
      {error // TODO: a better error feedback
        ? <Icon name='error' size={30} color='red' />
        : null
      }
      <FloatingButton name={'search'} onPress={toggleFilter} />
    </View>
  );
};

export const SearchInput = () => {
  const query = useSelector(getQuery);
  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery] = useDebounce(searchQuery, 1000);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageIfNeeded(debouncedQuery, 1));
  }, [debouncedQuery]);

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

// TODO: maybe implement pull to refresh
export const BookmarkList = () => {
  const bookmarkRepos = useSelector(getBookmarkedRepositories);
  const bookmarkURLs = useSelector(getBookmarkedURLs);
  const filteredBookmarks =
    bookmarkRepos.filter(repo => bookmarkURLs.includes(repo.url));
  return (
    <FlatList
      data={filteredBookmarks}
      keyExtractor={repo => repo.url}
      renderItem={({ item }) =>
        <RepositoryItem item={item} />
      }
    >
    </FlatList>
  );
};

//TODO: maybe implement pull to refresh
export const RepositoryList = () => {
  const page = useSelector(getPage);
  const query = useSelector(getQuery);
  const loading = useSelector(isFetchingSearch);
  const loadedRepos = useSelector(getLoadedRepositories);
  const flattenedList = [].concat.apply([], loadedRepos);
  const dispatch = useDispatch();

  const checkDistanceToBottom = evt => {
    if (loading) {
      return;
    }
    const THRESHOLD = 2000;
    const { contentOffset, contentSize } = evt.nativeEvent;
    const distanceToBottom =
      contentSize.height - contentOffset.y - Dimensions.get('window').height;
    if (distanceToBottom < THRESHOLD) {
      dispatch(fetchPageIfNeeded(query, page + 1));
    }
  };

  return (
    <FlatList
      data={flattenedList}
      onScroll={checkDistanceToBottom}
      keyExtractor={repo => repo.url}
      renderItem={({ item }) =>
        <RepositoryItem item={item} />
      }
    >
    </FlatList>
  );
};

export const RepositoryItem = ({ item }) => {
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
    console.log('SETTING ITEM', item);
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
    <ListItem bottomDivider onPress={previewRepo}>
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

export const BookmarkButton = ({ url }) => {
  const bookmarkedURLs = useSelector(getBookmarkedURLs);
  const dispatch = useDispatch();
  const isBookmarked = bookmarkedURLs.includes(url);

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
