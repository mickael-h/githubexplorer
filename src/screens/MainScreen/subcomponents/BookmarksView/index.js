import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import style from './style';
import FloatingButton from '../../../../components/FloatingButton';
import { useSelector } from 'react-redux';
import {
  getBookmarkedURLs,
  isFetchingBookmarks,
  hasBookmarksError,
} from '../../../../selectors';
import BookmarkList from '../BookmarkList';
import FillerMessage from '../FillerMessage';
import texts from '../../../../texts';

const BookmarksView = ({ toggleFilter }) => {
  const showLoading = useSelector(isFetchingBookmarks);
  const error = useSelector(hasBookmarksError);
  const bookmarkURLs = useSelector(getBookmarkedURLs);
  const showNoBookmarks = bookmarkURLs.length == 0 && !showLoading && !error;
  const showError = error && !showLoading && !showNoBookmarks;

  return (
    <View style={style.mainView}>
      {showNoBookmarks
        ? <FillerMessage value={texts.no_bookmarks} />
        : <BookmarkList />
      }
      {showLoading
        ? <ActivityIndicator
          testID='BookmarkLoading'
          animating size='large'
          color='blue'
        />
        : null
      }
      {showError
        ? <FillerMessage error value={texts.bookmarks_error} />
        : null
      }
      <FloatingButton name='search' onPress={toggleFilter} />
    </View>
  );
};

export default BookmarksView;
