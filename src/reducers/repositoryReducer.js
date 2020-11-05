import {
  SELECT_REPO,
  REQUEST_PAGE,
  RECEIVE_PAGE,
  RECEIVE_README,
} from '../actions/types';

// page is initialized to 0 to show
// that no page has been loaded yet,
// which triggers the first request on mount.
export const initialState = {
  displayedRepository: {},
  loadedRepositories: [],
  query: '',
  page: 0,
  hasReachedFinalPage: false,
  error: null,
  fetching: false,
};

const repositoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_REPO:
      return selectRepo(state, action);
    case REQUEST_PAGE:
      return requestPage(state, action);
    case RECEIVE_PAGE:
      return receivePage(state, action);
    case RECEIVE_README:
      return receiveReadme(state, action);
    default:
      return state;
  }
};

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
