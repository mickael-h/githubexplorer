import {
  BOOKMARK_REPO,
  REMOVE_BOOKMARK,
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
} from '../actions/types';

// page is initialized to 0 to show
// that no page has been loaded yet.
const initialState = {
  displayedRepository: {},
  loadedRepositories: [],
  bookmarks: [],
  query: '',
  page: 0,
  error: null,
  fetching: false,
};

const addBookmark = (state, { id }) => ({
  ...state,
  bookmarks: state.bookmarks.concat(id),
});

const removeBookmark = (state, { id }) => ({
  ...state,
  bookmarks: state.bookmarks.filter(bId => bId !== id),
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
    default:
      return state;
  }
};

export default repositoryReducer;
