import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBookmarksIfNeeded } from '../../actions/repository';
import texts from '../../texts';
import BookmarksView from './subcomponents/BookmarksView';
import SearchView from './subcomponents/SearchView';

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
      text: texts.repos_title,
    },
    background: {
      color: '#BBBBFF',
    },
  },
};

export default MainScreen;
