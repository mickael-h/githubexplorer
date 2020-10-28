import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
  UPDATE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  RECEIVE_BOOKMARKS,
} from '../actions/types';

// page is initialized to 0 to show
// that no page has been loaded yet.
const initialState = {
  displayedRepository: {},
  loadedRepositories: [],
  bookmarkedRepositories: [],
  bookmarks: [],
  query: '',
  page: 0,
  error: null,
  bookmarkError: null,
  fetching: false,
  fetchingBookmarks: false,
};

const repositoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKMARK_REPO:
      return addBookmark(state, action);
    case REMOVE_BOOKMARK:
      return removeBookmark(state, action);
    case SELECT_REPO:
      return selectRepo(state, action);
    case REQUEST_PAGE:
      return requestPage(state, action);
    case RECEIVE_PAGE:
      return receivePage(state, action);
    case UPDATE_BOOKMARKS:
      return updateBookmarks(state, action);
    case REQUEST_BOOKMARKS:
      return requestBookmarks(state);
    case RECEIVE_BOOKMARKS:
      return receiveBookmarks(state, action);
    default:
      return state;
  }
};

const addBookmark = (state, { url }) => ({
  ...state,
  bookmarks: state.bookmarks.concat(url),
});

const removeBookmark = (state, { url }) => ({
  ...state,
  bookmarks: state.bookmarks.filter(bUrl => bUrl !== url),
});

const selectRepo = (state, { repo }) => ({
  ...state,
  displayedRepository: repo,
});

const requestPage = (state, { query, page, wipeResults }) => {
  const newState = {
    ...state,
    query,
    page,
    fetching: true,
  };
  if (wipeResults) {
    newState.loadedRepositories = [];
  }
  return newState;
};

const receivePage = (state, { query, page, error, repos }) => {
  if (query != state.query) {
    // This is the response for an old query, so we ignore it.
    return state;
  }

  if (Boolean(error)) {
    return {
      ...state,
      fetching: false,
      error,
    };
  }

  const newRepos = [...state.loadedRepositories];
  newRepos[page - 1] = repos;
  return {
    ...state,
    error: null,
    fetching: false,
    loadedRepositories: newRepos,
  };
};

const updateBookmarks = (state, { bookmarkedRepositories }) => ({
  ...state,
  bookmarkedRepositories,
});

const requestBookmarks = state => ({
  ...state,
  fetchingBookmarks: true,
});

const receiveBookmarks = (state, { error, repos }) => {
  const loadedBookmarks = repos.filter(repo => state.bookmarks.includes(repo.url));
  if (loadedBookmarks.length == 0) {
    // We filtered the repositories that have been unbookmarked
    // by the time we received the response to the request.
    // If there's nothing left, then no update is needed.
    return {
      ...state,
      fetchingBookmarks: false,
    };
  }

  if (Boolean(error)) {
    return {
      ...state,
      fetchingBookmarks: false,
      bookmarkError: error,
    };
  }

  const bookmarkedRepositories = [
    ...state.bookmarkedRepositories,
    ...loadedBookmarks,
  ].sort((a, b) => b.stars - a.stars);

  return {
    ...state,
    bookmarkError: error,
    fetchingBookmarks: false,
    bookmarkedRepositories,
  };
};


export default repositoryReducer;
