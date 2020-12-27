export const getPage = state =>
  state.repositoryReducer.page;

export const getQuery = state =>
  state.repositoryReducer.query;

export const isFetchingSearch = state =>
  state.repositoryReducer.fetching;

export const hasSearchError = state =>
  state.repositoryReducer.error != null;

export const searchErrorMessage = state =>
  state.repositoryReducer.error;

export const isFetchingBookmarks = state =>
  state.bookmarkReducer.fetching;

export const hasBookmarksError = state =>
  state.bookmarkReducer.error != null;

export const getLoadedRepositories = state =>
  state.repositoryReducer.loadedRepositories;

export const getBookmarkedURLs = state =>
  state.bookmarkReducer.bookmarkedURLs;

export const getBookmarkedRepositories = state =>
  state.bookmarkReducer.bookmarkedRepositories;

export const getDisplayedRepository = state =>
  state.repositoryReducer.displayedRepository;

export const getTexts = state =>
  state.localeReducer.texts;
