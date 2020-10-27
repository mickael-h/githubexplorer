export const getPage = store =>
  store.repositoryReducer.page;

export const getQuery = store =>
  store.repositoryReducer.query;

export const isFetching = store =>
  store.repositoryReducer.fetching;

export const hasError = store =>
  store.repositoryReducer.error != null;

export const getLoadedRepositories = store =>
  store.repositoryReducer.loadedRepositories;

export const getBookmarks = store =>
  store.repositoryReducer.bookmarks;

export const getDisplayedRepository = store =>
  store.repositoryReducer.displayedRepository;
