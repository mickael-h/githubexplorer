import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMostStarred, fetchRepos, fetchReadme } from '../services/github';
import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  RECEIVE_README,
  REQUEST_PAGE,
  RECEIVE_PAGE,
  UPDATE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  RECEIVE_BOOKMARKS,
  ADD_STORED_BOOKMARKS,
} from './types';

export const bookmarkRepo = url => ({
  type: BOOKMARK_REPO,
  url,
});

export const removeBookmark = url => ({
  type: REMOVE_BOOKMARK,
  url,
});

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

export const loadBookmarks = key =>
  async dispatch => {
    const bookmarks = JSON.parse(await AsyncStorage.getItem(key));
    return Array.isArray(bookmarks) && bookmarks.length > 0
      ? dispatch(addStoredBookmarks(bookmarks))
      : null;
  };

const addStoredBookmarks = urls => ({
  type: ADD_STORED_BOOKMARKS,
  urls,
});

export const fetchBookmarksIfNeeded = () =>
  (dispatch, getState) => {
    const {
      bookmarkReducer: markState,
      repositoryReducer: repoState,
    } = getState();
    const reposAlreadyLoaded = getReposLoaded(markState, repoState);
    const repoURLsToLoad = getRepoURLsToLoad(markState, reposAlreadyLoaded);
    const loadedListNeedsUpdate =
      !areRepoListsEqual(markState.bookmarkedRepositories, reposAlreadyLoaded);

    if (loadedListNeedsUpdate) {
      dispatch(updateBookmarks(reposAlreadyLoaded));
    }

    if (repoURLsToLoad.length > 0) {
      return dispatch(fetchBookmarks(repoURLsToLoad));
    } else {
      return null;
    }
  };

const areRepoListsEqual = (list1, list2) =>
  list1.length == list2.length &&
  list1.every(repo1 => list2.some(repo2 => repo1.url == repo2.url));

const getReposLoaded = ({ bookmarkedURLs, bookmarkedRepositories }, { loadedRepositories }) => {
  const flatLoaded = [].concat.apply([], loadedRepositories);
  const isInBookmarkURLsList = repo => bookmarkedURLs.includes(repo.url);
  const filteredLoaded = flatLoaded.filter(isInBookmarkURLsList);
  const filteredBookmarked = bookmarkedRepositories.filter(isInBookmarkURLsList);
  return getUniqueRepoList(filteredBookmarked, filteredLoaded);
};

const getUniqueRepoList = (repoList1, repoList2) => {
  const mergedObj = {};
  const tranferRepo = repo => mergedObj[repo.url] = repo;
  repoList1.forEach(tranferRepo);
  repoList2.forEach(tranferRepo);
  return Object.values(mergedObj);
};

const getRepoURLsToLoad = ({ bookmarkedURLs }, reposLoaded) =>
  bookmarkedURLs.filter(url => !reposLoaded.some(repo => repo.url == url));


const updateBookmarks = bookmarkedRepositories => ({
  type: UPDATE_BOOKMARKS,
  bookmarkedRepositories,
});

const fetchBookmarks = repoURLsToLoad =>
  async dispatch => {
    dispatch(requestBookmarks());
    try {
      const res = await fetchRepos(repoURLsToLoad);
      return dispatch(receiveBookmarks(res));
    } catch (error) {
      return dispatch(receiveBookmarks(null, error));
    }
  };

const requestBookmarks = () => ({
  type: REQUEST_BOOKMARKS,
});

const receiveBookmarks = (repos, error = null) => ({
  type: RECEIVE_BOOKMARKS,
  repos,
  error,
});
