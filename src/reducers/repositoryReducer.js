import { BOOKMARK_REPO, REMOVE_BOOKMARK, SET_DISPLAYED_REPOS } from '../actions/types';

const initialState = {
  repositories: ['trololo'],
  bookmarks: [],
};

const repositoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOKMARK_REPO:
      return {
        ...state,
        bookmarks: state.bookmarks.concat(action.id),
      };
    case REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.repositoryList.filter(id => id !== action.id),
      };
    case SET_DISPLAYED_REPOS:
      return {
        ...state,
        repositories: action.repos,
      };
    default:
      return state;
  }
};

export default repositoryReducer;
