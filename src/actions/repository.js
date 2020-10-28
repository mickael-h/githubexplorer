import { fetchMostStarred, fetchRepos } from '../services/github';
import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
  UPDATE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  RECEIVE_BOOKMARKS,
} from './types';

export const bookmarkRepo = url => ({
  type: BOOKMARK_REPO,
  url,
});

export const removeBookmark = url => ({
  type: REMOVE_BOOKMARK,
  url,
});

export const setDisplayedRepo = repo => ({
  type: SELECT_REPO,
  repo,
});

export const fetchPageIfNeeded = (query, page) =>
  (dispatch, getState) => {
    const state = getState().repositoryReducer;
    console.log('current state page', state);
    const qPage = page || 1;
    return shouldFetchPage(state, query, qPage)
      ? dispatch(fetchPage(query, qPage, shouldWipeResults(state, query)))
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

export const fetchBookmarksIfNeeded = () =>
  (dispatch, getState) => {
    const state = getState().repositoryReducer;
    console.log('current state bookmarks', state);
    const reposAlreadyLoaded = getReposLoaded(state);
    const repoURLsToLoad = getRepoURLsToLoad(state, reposAlreadyLoaded);
    const loadedListNeedsUpdate =
      !areRepoListsEqual(state.bookmarkedRepositories, reposAlreadyLoaded);

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
  list1.some(repo1 => !list2.some(repo2 => repo1.url == repo2.url));

const getReposLoaded = ({ bookmarks, bookmarkedRepositories, loadedRepositories }) => {
  const flatLoaded = [].concat.apply([], loadedRepositories);
  const isInBookmarks = repo => bookmarks.includes(repo.url);
  const filteredLoaded = flatLoaded.filter(isInBookmarks);
  const filteredBookmarked = bookmarkedRepositories.filter(isInBookmarks);
  return getUniqueRepoList(filteredBookmarked, filteredLoaded);
};

const getUniqueRepoList = (repoList1, repoList2) => {
  const mergedObj = {};
  const tranferRepo = repo => mergedObj[repo.url] = repo;
  repoList1.forEach(tranferRepo);
  repoList2.forEach(tranferRepo);
  return Object.values(mergedObj);
};

const getRepoURLsToLoad = ({ bookmarks }, reposLoaded) =>
  bookmarks.filter(url => !reposLoaded.some(repo => repo.url == url));


const updateBookmarks = bookmarkedRepositories => ({
  type: UPDATE_BOOKMARKS,
  bookmarkedRepositories,
});

const fetchBookmarks = repoURLsToLoad => {
  return async dispatch => {
    dispatch(requestBookmarks());
    try {
      const res = await fetchRepos(repoURLsToLoad);
      return dispatch(receiveBookmarks(res));
    } catch (error) {
      return dispatch(receiveBookmarks(null, error));
    }
  };
};

const requestBookmarks = () => ({
  type: REQUEST_BOOKMARKS,
});

const receiveBookmarks = (repos, error = null) => ({
  type: RECEIVE_BOOKMARKS,
  repos,
  error,
});
