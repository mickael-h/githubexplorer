import React, { useEffect, useState } from 'react';
import { Icon, Input } from 'react-native-elements';
import { useDebounce } from 'use-debounce/lib';
import style from './style';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPageIfNeeded, } from '../../../../actions/repositoryActions';
import {
  getQuery,
  getTexts,
} from '../../../../selectors';

const SearchInput = () => {
  const query = useSelector(getQuery);
  const texts = useSelector(getTexts);
  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery] = useDebounce(searchQuery, 1000);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageIfNeeded(debouncedQuery, 1));
  }, [debouncedQuery]);

  return (
    <Input
      testID='SearchInput'
      placeholder={texts.placeholder_search}
      value={searchQuery}
      onChangeText={txt => setSearchQuery(txt)}
      rightIcon={<Icon
        testID='EraseSearchButton'
        disabled={!Boolean(searchQuery)}
        disabledStyle={style.hiddenButton}
        name='cancel'
        onPress={() => setSearchQuery('')}
      />}
    />
  );
};

export default SearchInput;
