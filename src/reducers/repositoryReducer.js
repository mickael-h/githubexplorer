import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
  UPDATE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  RECEIVE_BOOKMARKS,
  RECEIVE_README,
} from '../actions/types';

// page is initialized to 0 to show
// that no page has been loaded yet,
// which triggers the first request on mount.
export const initialState = {
  displayedRepository: {},
  loadedRepositories: [],
  bookmarkedRepositories: [],
  bookmarkedURLs: [],
  query: '',
  page: 0,
  hasReachedFinalPage: false,
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
    case RECEIVE_README:
      return receiveReadme(state, action);
    default:
      return state;
  }
};

const addBookmark = (state, { url }) => ({
  ...state,
  bookmarkedURLs: state.bookmarkedURLs.concat(url),
});

const removeBookmark = (state, { url }) => ({
  ...state,
  bookmarkedURLs: state.bookmarkedURLs.filter(bUrl => bUrl !== url),
});

const selectRepo = (state, { repo }) => ({
  ...state,
  displayedRepository: {
    ...repo,
    fetchingReadme: true,
  },
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
    newState.hasReachedFinalPage = false;
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

  if (repos.length == 0) {
    return {
      ...state,
      fetching: false,
      hasReachedFinalPage: true,
      error: null,
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
  bookmarkedRepositories:
    bookmarkedRepositories.sort(sortRepos),
});

const requestBookmarks = state => ({
  ...state,
  fetchingBookmarks: true,
});

const receiveBookmarks = (state, { error, repos }) => {
  if (Boolean(error)) {
    return {
      ...state,
      fetchingBookmarks: false,
      bookmarkError: error,
    };
  }

  const loadedBookmarks = repos.filter(repo => state.bookmarkedURLs.includes(repo.url));
  if (loadedBookmarks.length == 0) {
    // We filtered the repositories that have been unbookmarked
    // by the time we received the response to the request.
    // If there's nothing left, then no update is needed.
    return {
      ...state,
      fetchingBookmarks: false,
    };
  }

  const bookmarkedRepositories = [
    ...state.bookmarkedRepositories,
    ...loadedBookmarks,
  ].sort(sortRepos);

  return {
    ...state,
    bookmarkError: error,
    fetchingBookmarks: false,
    bookmarkedRepositories,
  };
};

const sortRepos = (repo1, repo2) =>
  repo2.stars - repo1.stars;

const receiveReadme = (state, { readmeError, readme, repoUrl }) => {
  const displayedRepo = state.displayedRepository;
  if (!isDisplayedRepoWaitingForReadme(displayedRepo, repoUrl)) {
    return state;
  }
  return {
    ...state,
    displayedRepository: {
      ...displayedRepo,
      fetchingReadme: false,
      readme,
      readmeError,
    },
  };
};

const isDisplayedRepoWaitingForReadme = (displayedRepo, receivedUrl) =>
  displayedRepo.fetchingReadme && displayedRepo.url == receivedUrl;


export default repositoryReducer;
