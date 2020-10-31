import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBookmarksIfNeeded, loadBookmarks } from '../../actions/repository';
import texts from '../../texts';
import BookmarksView from './subcomponents/BookmarksView';
import SearchView from './subcomponents/SearchView';

const MainScreen = () => {
  const dispatch = useDispatch();
  const [filterBookmarks, setFilterBookmarks] = useState(false);

  useEffect(() => {
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
    title: {
      text: texts.repos_title,
    },
    background: {
      color: '#BBBBFF',
    },
  },
};

export default MainScreen;
