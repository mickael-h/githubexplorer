export const getPage = state =>
  state.repositoryReducer.page;

export const getQuery = state =>
  state.repositoryReducer.query;

export const isFetchingSearch = state =>
  state.repositoryReducer.fetching;

export const hasSearchError = state =>
  state.repositoryReducer.error != null;

export const isFetchingBookmarks = state =>
  state.repositoryReducer.fetchingBookmarks;

export const hasBookmarksError = state =>
  state.repositoryReducer.bookmarkError != null;

export const getLoadedRepositories = state =>
  state.repositoryReducer.loadedRepositories;

export const getBookmarkedURLs = state =>
  state.repositoryReducer.bookmarks;

export const getBookmarkedRepositories = state =>
  state.repositoryReducer.bookmarkedRepositories;

export const getDisplayedRepository = state =>
  state.repositoryReducer.displayedRepository;
