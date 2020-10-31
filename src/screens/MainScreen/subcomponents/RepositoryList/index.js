import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageIfNeeded } from '../../../../actions/repository';
import {
  getLoadedRepositories,
  isFetchingSearch,
  getPage,
  getQuery,
} from '../../../../selectors';
import RepositoryItem from '../RepositoryItem';

const RepositoryList = () => {
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
      contentSize.height - contentOffset.y - responsiveHeight(100);
    if (distanceToBottom < THRESHOLD) {
      dispatch(fetchPageIfNeeded(query, page + 1));
    }
  };

  const renderItem = useCallback(
    ({ item }) => <RepositoryItem item={item} />,
    [],
  );

  const keyExtractor = useCallback(
    repo => repo.url,
    [],
  );

  return (
    <FlatList
      removeClippedSubviews
      testID='RepositoryList'
      data={flattenedList}
      windowSize={10}
      onScroll={checkDistanceToBottom}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

export default RepositoryList;
