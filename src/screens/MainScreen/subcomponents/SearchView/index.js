import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import style from './style';
import FloatingButton from '../../../../components/FloatingButton';
import { useSelector } from 'react-redux';
import {
  getLoadedRepositories,
  isFetchingSearch,
  hasSearchError,
  searchErrorMessage,
} from '../../../../selectors';
import SearchInput from '../SearchInput';
import FillerMessage from '../FillerMessage';
import RepositoryList from '../RepositoryList';
import texts from '../../../../texts';

const SearchView = ({ toggleFilter }) => {
  const loadedRepos = useSelector(getLoadedRepositories);
  const loading = useSelector(isFetchingSearch);
  const error = useSelector(hasSearchError);
  const errorMessage = useSelector(searchErrorMessage);
  const hasRepos = loadedRepos.length > 0 && loadedRepos[0].length > 0;
  const showRepos = hasRepos || loading || error;
  const showLoading = loading && !hasRepos;
  const showError = error && !loading && !hasRepos;

  return (
    <View
      testID='SearchView'
      style={style.mainView}
    >
      <SearchInput />
      {showLoading
        ? <ActivityIndicator animating size='large' color='blue' />
        : null
      }
      {showError
        ? <FillerMessage error errorMessage={errorMessage}
          value={texts.search_error} />
        : null
      }
      {showRepos
        ? <RepositoryList />
        : <FillerMessage value={texts.search_empty} />
      }
      <FloatingButton name='favorite' onPress={toggleFilter} />
    </View>
  );
};

export default SearchView;
