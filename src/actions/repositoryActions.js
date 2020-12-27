import { fetchMostStarred, fetchReadme } from '../services/github';
import {
  SELECT_REPO,
  RECEIVE_README,
  REQUEST_PAGE,
  RECEIVE_PAGE,
} from './types';

export const setDisplayedRepo = repo =>
  (dispatch, getState) => {
    const state = getState().repositoryReducer;
    if (state.displayedRepository.url == repo.url) {
      return null;
    }
    dispatch(displayRepoBasicInfo(repo));
    return dispatch(fetchReadmeContent(repo));
  };

const fetchReadmeContent = ({ url }) =>
  async dispatch => {
    try {
      const res = await fetchReadme(url);
      return dispatch(receiveReadme(url, res));
    } catch (error) {
      return dispatch(receiveReadme(url, null, error));
    }
  };

const displayRepoBasicInfo = repo => ({
  type: SELECT_REPO,
  repo,
});

const receiveReadme = (repoUrl, readme, readmeError = null) => ({
  type: RECEIVE_README,
  repoUrl,
  readme,
  readmeError,
});

export const fetchPageIfNeeded = (query, page) =>
  (dispatch, getState) => {
    const state = getState().repositoryReducer;
    const qPage = page || 1;
    return shouldFetchPage(state, query, qPage)
      ? dispatch(fetchPage(query, qPage, shouldWipeResults(state, query)))
      : null;
  };

const shouldFetchPage = (state, newQuery, newPage) =>
  shouldWipeResults(state, newQuery) ||
  (!state.hasReachedFinalPage && newPage > state.page);

const shouldWipeResults = (state, newQuery) =>
  state.query != newQuery;

const fetchPage = (query, page, wipeResults) =>
  async dispatch => {
    dispatch(requestPage(query, page, wipeResults));
    try {
      const res = await fetchMostStarred(query, page);
      return dispatch(receivePage(query, page, res));
    } catch (error) {
      return dispatch(receivePage(query, page, null, error));
    }
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
