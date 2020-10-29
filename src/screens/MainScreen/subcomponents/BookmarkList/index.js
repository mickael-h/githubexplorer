import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import {
  getBookmarkedURLs,
  getBookmarkedRepositories,
} from '../../../../selectors';
import RepositoryItem from '../RepositoryItem';

const BookmarkList = () => {
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

export default BookmarkList;
