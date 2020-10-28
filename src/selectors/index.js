export const getPage = state =>
  state.repositoryReducer.page;

export const getQuery = state =>
  state.repositoryReducer.query;

export const isFetching = state =>
  state.repositoryReducer.fetching;

export const hasError = state =>
  state.repositoryReducer.error != null;

export const getLoadedRepositories = state =>
  state.repositoryReducer.loadedRepositories;

export const getBookmarkedURLs = state =>
  state.repositoryReducer.bookmarks;

export const getBookmarkedRepositories = state =>
  state.repositoryReducer.bookmarkedRepositories;

export const getDisplayedRepository = state =>
  state.repositoryReducer.displayedRepository;
