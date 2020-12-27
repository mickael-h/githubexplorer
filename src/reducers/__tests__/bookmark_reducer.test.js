import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock-jest';
import bookmarkReducer, { initialState as markInitState } from '../bookmarkReducer';
import {
  ADD_STORED_BOOKMARKS,
  RECEIVE_BOOKMARKS,
  REQUEST_BOOKMARKS,
  UPDATE_BOOKMARKS,
} from '../../actions/types';
import {
  bookmarkRepo,
  removeBookmark,
  fetchBookmarksIfNeeded,
  loadBookmarks,
} from '../../actions/bookmarkActions';
import {
  REPO_URL_EXAMPLE_1,
  REPO_URL_EXAMPLE_2,
  REPO_URL_EXAMPLE_3,
  REPO_EXAMPLE_1,
  REPO_EXAMPLE_2,
  REPO_EXAMPLE_3,
  RAW_REPO_EXAMPLE_2,
  RAW_REPO_EXAMPLE_3,
  PAGE_EXAMPLE,
  INITIAL_STATE,
  STATE_WITH_1_LOADED_REPO,
  STATE_WITH_BOOKMARKED_REPOS_TO_FETCH,
  STATE_WITH_1_LOADED_BOOKMARK,
  STATE_WITH_1_BOOKMARKED_REPO_TO_FETCH,
  STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED,
} from '../../data_examples';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sync unit tests', () => {
  test('add bookmark', () => {
    const newState = bookmarkReducer(
      STATE_WITH_1_LOADED_REPO.bookmarkReducer,
      bookmarkRepo(REPO_URL_EXAMPLE_1)
    );
    expect(newState.bookmarkedURLs).toHaveLength(1);
    expect(newState.bookmarkedURLs[0]).toEqual(REPO_URL_EXAMPLE_1);
  });

  test('remove bookmark', () => {
    const newState = bookmarkReducer(
      STATE_WITH_BOOKMARKED_REPOS_TO_FETCH.bookmarkReducer,
      removeBookmark(REPO_URL_EXAMPLE_2)
    );
    expect(newState.bookmarkedURLs).toEqual([
      REPO_URL_EXAMPLE_1,
      REPO_URL_EXAMPLE_3,
    ]);
  });

  test('wrong action and undefined state', () => {
    const newState = bookmarkReducer(undefined, { type: 'wrong type' });
    expect(newState).toBe(markInitState);
  });
});

describe('fetch bookmarks async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const load3BookmarksExpectedActions = [{
    type: ADD_STORED_BOOKMARKS,
    urls: [
      REPO_URL_EXAMPLE_1,
      REPO_URL_EXAMPLE_2,
      REPO_URL_EXAMPLE_3,
    ],
  }];

  test('load 3 bookmarks from storage dispatch', () => {
    const store = mockStore(INITIAL_STATE);

    return store.dispatch(loadBookmarks('fake_bookmarks'))
      .then(() => {
        expect(store.getActions()).toEqual(load3BookmarksExpectedActions);
      });
  });

  test('load 3 bookmarks from storage actions', () => {
    const stateAfterLoad =
      bookmarkReducer(markInitState, load3BookmarksExpectedActions[0]);
    expect(stateAfterLoad).toEqual({
      ...markInitState,
      bookmarkedURLs: load3BookmarksExpectedActions[0].urls,
    });
  });

  const getBookmarksExpectedActions = [
    {
      type: UPDATE_BOOKMARKS,
      bookmarkedRepositories: [REPO_EXAMPLE_1],
    },
    {
      type: REQUEST_BOOKMARKS,
    },
    {
      type: RECEIVE_BOOKMARKS,
      error: null,
      repos: [
        REPO_EXAMPLE_2,
        REPO_EXAMPLE_3,
      ],
    },
  ];

  test('get bookmarked repositories dispatch', () => {
    const store = mockStore(STATE_WITH_BOOKMARKED_REPOS_TO_FETCH);
    fetchMock.getOnce(REPO_URL_EXAMPLE_2, { body: RAW_REPO_EXAMPLE_2 });
    fetchMock.getOnce(REPO_URL_EXAMPLE_3, { body: RAW_REPO_EXAMPLE_3 });

    return store.dispatch(fetchBookmarksIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(getBookmarksExpectedActions);
      });
  });

  test('get bookmarks already loaded dispatch 1', () => {
    const store = mockStore(STATE_WITH_1_LOADED_BOOKMARK);
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarks already loaded dispatch 2', () => {
    const store = mockStore(STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED);
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarks already loaded dispatch 3', () => {
    const store = mockStore(STATE_WITH_1_BOOKMARKED_REPO_TO_FETCH);
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarked repositories actions', () => {
    const stateAfterUpdate =
      bookmarkReducer(
        STATE_WITH_BOOKMARKED_REPOS_TO_FETCH.bookmarkReducer,
        getBookmarksExpectedActions[0]
      );
    expect(stateAfterUpdate).toEqual({
      ...STATE_WITH_BOOKMARKED_REPOS_TO_FETCH.bookmarkReducer,
      bookmarkedRepositories: [REPO_EXAMPLE_1],
    });

    const stateAfterRequest =
      bookmarkReducer(stateAfterUpdate, getBookmarksExpectedActions[1]);
    expect(stateAfterRequest).toEqual({
      ...stateAfterUpdate,
      fetching: true,
    });

    const stateAfterReceive =
      bookmarkReducer(stateAfterRequest, getBookmarksExpectedActions[2]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      error: null,
      fetching: false,
      bookmarkedRepositories: PAGE_EXAMPLE,
    });
  });

  test('get bookmarks and receive unbookmarked repos action', () => {
    const stateAfterReceive =
      bookmarkReducer(
        STATE_WITH_1_LOADED_BOOKMARK.bookmarkReducer,
        getBookmarksExpectedActions[2]
      );
    expect(stateAfterReceive).toEqual({
      ...STATE_WITH_1_LOADED_BOOKMARK.bookmarkReducer,
      fetching: false,
    });
  });

  const getBookmarksExpectedActionsWithError = [
    getBookmarksExpectedActions[0],
    getBookmarksExpectedActions[1],
    {
      type: RECEIVE_BOOKMARKS,
      error: 'some_error',
      repos: null,
    },
  ];


  test('get bookmarked repositories actions with errors', () => {
    const stateAfterRequest = {
      ...STATE_WITH_BOOKMARKED_REPOS_TO_FETCH.bookmarkReducer,
      bookmarkedRepositories: [REPO_EXAMPLE_1],
      fetching: true,
    };

    const stateAfterReceive =
      bookmarkReducer(stateAfterRequest, getBookmarksExpectedActionsWithError[2]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      fetching: false,
      error: 'some_error',
    });
  });

  test('get bookmarked repositories dispatch with errors', () => {
    const store = mockStore(STATE_WITH_BOOKMARKED_REPOS_TO_FETCH);
    fetchMock.getOnce(REPO_URL_EXAMPLE_2, {
      body: {
        errors: [],
        message: 'some_error',
      },
    });
    fetchMock.getOnce(REPO_URL_EXAMPLE_3, { body: RAW_REPO_EXAMPLE_3 });

    return store.dispatch(fetchBookmarksIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(getBookmarksExpectedActionsWithError);
      });
  });
});
