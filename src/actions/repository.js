import { fetchMostStarred } from '../services/github';
import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
} from './types';

export const bookmarkRepo = id => ({
  type: BOOKMARK_REPO,
  id,
});

export const removeBookmark = id => ({
  type: REMOVE_BOOKMARK,
  id,
});

export const setDisplayedRepo = repo => ({
  type: SELECT_REPO,
  repo,
});

export const fetchPageIfNeeded = (query, page) =>
  (dispatch, getState) => {
    const state = getState();
    return shouldFetchPage(state, query, page)
      ? dispatch(fetchPage(query, page, shouldWipeResults(state, query)))
      : null;
  };

const shouldFetchPage = (state, newQuery, newPage) =>
  state.query != newQuery || state.page != newPage;

const shouldWipeResults = (state, newQuery) =>
  state.query != newQuery;

const fetchPage = (query, page, wipeResults) => {
  return async dispatch => {
    dispatch(requestPage(query, page, wipeResults));
    try {
      const res = await fetchMostStarred(query, page);
      return dispatch(receivePage(query, page, res));
    } catch (error) {
      return dispatch(receivePage(query, page, null, error));
    }
  };
};

const requestPage = (query, page, wipeResults) => ({
  type: REQUEST_PAGE,
  query,
  page,
  wipeResults,
});

const receivePage = (query, page, repos, error = null) => ({
  type: RECEIVE_PAGE,
  query,
  page,
  error,
  repos,
});
