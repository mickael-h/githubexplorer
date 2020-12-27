import React, { useEffect, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarksIfNeeded, loadBookmarks } from '../../actions/bookmarkActions';
import { initLanguage } from '../../actions/localeActions';
import { getTexts } from '../../selectors';
import BookmarksView from './subcomponents/BookmarksView';
import SearchView from './subcomponents/SearchView';

const MainScreen = props => {
  const texts = useSelector(getTexts);
  const dispatch = useDispatch();
  const [filterBookmarks, setFilterBookmarks] = useState(false);

  useEffect(() => {
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        title: {
          text: texts.repos_title,
        },
      },
    });
  }, [texts]);

  useEffect(() => {
    dispatch(initLanguage());
    dispatch(loadBookmarks('github_bookmarks'));
  }, []);

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
    background: {
      color: '#BBBBFF',
    },
  },
};

export default MainScreen;
