import React from 'react';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookmarkRepo,
  removeBookmark,
} from '../../../../actions/repository';
import { getBookmarkedURLs } from '../../../../selectors';

const BookmarkButton = ({ url }) => {
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
      testID='BookmarkButton'
      name={isBookmarked ? 'favorite' : 'favorite-outline'}
      color='red'
      size={30}
      onPress={toggleBookmark}
    />
  );
};

export default BookmarkButton;
