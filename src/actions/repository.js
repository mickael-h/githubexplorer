import { BOOKMARK_REPO, REMOVE_BOOKMARK, SET_DISPLAYED_REPOS } from './types';

export const bookmarkRepo = id => ({
  type: BOOKMARK_REPO,
  id,
});

export const removeBookmark = id => ({
  type: REMOVE_BOOKMARK,
  id,
});

export const setDisplayedRepos = repos => ({
  type: SET_DISPLAYED_REPOS,
  repos,
});
