import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  UPDATE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  RECEIVE_BOOKMARKS,
  ADD_STORED_BOOKMARKS,
} from '../actions/types';

// page is initialized to 0 to show
// that no page has been loaded yet,
// which triggers the first request on mount.
export const initialState = {
  bookmarkedRepositories: [],
  bookmarkedURLs: [],
  error: null,
  fetching: false,
};

const bookmarkReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKMARK_REPO:
      return addBookmark(state, action);
    case REMOVE_BOOKMARK:
      return removeBookmark(state, action);
    case UPDATE_BOOKMARKS:
      return updateBookmarks(state, action);
    case REQUEST_BOOKMARKS:
      return requestBookmarks(state);
    case RECEIVE_BOOKMARKS:
      return receiveBookmarks(state, action);
    case ADD_STORED_BOOKMARKS:
      return addStoredBookmarks(state, action);
    default:
      return state;
  }
};

const addBookmark = (state, { url }) => {
  const newState = {
    ...state,
    bookmarkedURLs: state.bookmarkedURLs.concat(url),
  };
  saveBookmarks(newState.bookmarkedURLs);
  return newState;
};

const addStoredBookmarks = (state, { urls }) => ({
  ...state,
  bookmarkedURLs: state.bookmarkedURLs.concat(urls),
});

const removeBookmark = (state, { url }) => {
  const newState = {
    ...state,
    bookmarkedURLs: state.bookmarkedURLs.filter(bUrl => bUrl !== url),
  };
  saveBookmarks(newState.bookmarkedURLs);
  return newState;
};

const saveBookmarks = bookmarks =>
  AsyncStorage.setItem('github_bookmarks', JSON.stringify(bookmarks));

const updateBookmarks = (state, { bookmarkedRepositories }) => ({
  ...state,
  bookmarkedRepositories:
    bookmarkedRepositories.sort(sortRepos),
});

const requestBookmarks = state => ({
  ...state,
  fetching: true,
});

const receiveBookmarks = (state, { error, repos }) => {
  if (Boolean(error)) {
    return {
      ...state,
      fetching: false,
      error,
    };
  }

  const loadedBookmarks = repos.filter(repo => state.bookmarkedURLs.includes(repo.url));
  if (loadedBookmarks.length == 0) {
    // We filtered the repositories that have been unbookmarked
    // by the time we received the response to the request.
    // If there's nothing left, then no update is needed.
    return {
      ...state,
      fetching: false,
    };
  }

  const bookmarkedRepositories = [
    ...state.bookmarkedRepositories,
    ...loadedBookmarks,
  ].sort(sortRepos);

  return {
    ...state,
    error,
    fetching: false,
    bookmarkedRepositories,
  };
};

const sortRepos = (repo1, repo2) =>
  repo2.stars - repo1.stars;

export default bookmarkReducer;
