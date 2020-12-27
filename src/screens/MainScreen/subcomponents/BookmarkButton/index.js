import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import {
  bookmarkRepo,
  removeBookmark,
} from '../../../../actions/bookmarkActions';
import { getBookmarkedURLs } from '../../../../selectors';

const BookmarkButton = ({ url, style }) => {
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
    <View style={style}>
      <Icon
        testID='BookmarkButton'
        name={isBookmarked ? 'favorite' : 'favorite-outline'}
        color='red'
        size={40}
        onPress={toggleBookmark}
      />
    </View>
  );
};

export default BookmarkButton;
