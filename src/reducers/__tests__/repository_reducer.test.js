import queryString from 'query-string';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock-jest';
import repositoryReducer, { initialState } from '../repositoryReducer';
import {
  README_ROUTE,
  API_URL,
  SEARCH_ROUTE,
  DEFAULT_QUERY,
} from '../../services/github';
import {
  RECEIVE_BOOKMARKS,
  RECEIVE_PAGE,
  RECEIVE_README,
  REQUEST_BOOKMARKS,
  REQUEST_PAGE,
  SELECT_REPO,
  UPDATE_BOOKMARKS,
} from '../../actions/types';
import {
  bookmarkRepo,
  removeBookmark,
  setDisplayedRepo,
  fetchPageIfNeeded,
  fetchBookmarksIfNeeded,
} from '../../actions/repository';
import {
  STATE_WITH_DISPLAYED_REPO,
  REPO_URL_EXAMPLE_1,
  REPO_URL_EXAMPLE_2,
  REPO_URL_EXAMPLE_3,
  REPO_EXAMPLE_1,
  REPO_EXAMPLE_2,
  REPO_EXAMPLE_3,
  RAW_REPO_EXAMPLE_2,
  RAW_REPO_EXAMPLE_3,
  PAGE_EXAMPLE,
  RAW_PAGE_EXAMPLE,
  EMPTY_RAW_PAGE_EXAMPLE,
  ENCODED_README,
  DECODED_README,
  STATE_WITH_1_LOADED_REPO,
  STATE_WITH_BOOKMARKED_REPOS_TO_FETCH,
  STATE_WITH_1_LOADED_BOOKMARK,
  STATE_WITH_1_BOOKMARKED_REPO_TO_FETCH,
  STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED,
} from '../../data_examples/data_examples';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sync unit tests', () => {
  test('add bookmark', () => {
    const newState = repositoryReducer(STATE_WITH_1_LOADED_REPO, bookmarkRepo(REPO_URL_EXAMPLE_1));
    expect(newState.bookmarkedURLs).toHaveLength(1);
    expect(newState.bookmarkedURLs[0]).toEqual(REPO_URL_EXAMPLE_1);
  });

  test('remove bookmark', () => {
    const newState = repositoryReducer(
      STATE_WITH_BOOKMARKED_REPOS_TO_FETCH, removeBookmark(REPO_URL_EXAMPLE_2));
    expect(newState.bookmarkedURLs).toEqual([
      REPO_URL_EXAMPLE_1,
      REPO_URL_EXAMPLE_3,
    ]);
  });

  test('wrong action and undefined state', () => {
    const newState = repositoryReducer(undefined, { type: 'wrong type' });
    expect(newState).toBe(initialState);
  });
});

describe('select repo async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const selectRepoWithReadmeExpectedActions = [
    {
      type: SELECT_REPO,
      repo: REPO_EXAMPLE_1,
    },
    {
      type: RECEIVE_README,
      repoUrl: REPO_URL_EXAMPLE_1,
      readme: DECODED_README,
      readmeError: null,
    },
  ];

  test('select repository dispatch with readme', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    fetchMock.getOnce(REPO_URL_EXAMPLE_1 + README_ROUTE, {
      body: {
        encoding: 'base64',
        content: ENCODED_README,
      },
    });

    return store.dispatch(setDisplayedRepo(REPO_EXAMPLE_1))
      .then(() => {
        expect(store.getActions()).toEqual(selectRepoWithReadmeExpectedActions);
      });
  });

  test('select repository dispatch with raw readme', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    fetchMock.getOnce(REPO_URL_EXAMPLE_1 + README_ROUTE, {
      body: {
        content: DECODED_README,
      },
    });

    return store.dispatch(setDisplayedRepo(REPO_EXAMPLE_1))
      .then(() => {
        expect(store.getActions()).toEqual(selectRepoWithReadmeExpectedActions);
      });
  });

  test('reselect same repository dispatch', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_DISPLAYED_REPO });
    expect(store.dispatch(setDisplayedRepo(REPO_EXAMPLE_1))).toBeNull();
  });

  test('select repository actions with readme', () => {
    const stateAfterSelect =
      repositoryReducer(STATE_WITH_1_LOADED_REPO, selectRepoWithReadmeExpectedActions[0]);
    expect(stateAfterSelect).toEqual({
      ...STATE_WITH_1_LOADED_REPO,
      displayedRepository: {
        ...REPO_EXAMPLE_1,
        fetchingReadme: true,
      },
    });

    const stateAfterReceive =
      repositoryReducer(stateAfterSelect, selectRepoWithReadmeExpectedActions[1]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterSelect,
      displayedRepository: {
        ...REPO_EXAMPLE_1,
        fetchingReadme: false,
        readme: DECODED_README,
        readmeError: null,
      },
    });
  });

  test('select repository actions with unexpected readme', () => {
    const stateAfterReceive =
      repositoryReducer(initialState, selectRepoWithReadmeExpectedActions[1]);
    expect(stateAfterReceive).toEqual(initialState);
  });

  const selectRepoWithoutReadmeExpectedActions = [
    {
      type: SELECT_REPO,
      repo: REPO_EXAMPLE_1,
    },
    {
      type: RECEIVE_README,
      repoUrl: REPO_URL_EXAMPLE_1,
      readme: null,
      readmeError: 'Not Found',
    },
  ];

  test('select repository dispatch without readme', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    fetchMock.getOnce(REPO_URL_EXAMPLE_1 + README_ROUTE, {
      body: {
        message: 'Not Found',
        documentation_url: 'https://docs.github.com/rest/reference/repos#get-repository-content',
      },
    });

    return store.dispatch(setDisplayedRepo(REPO_EXAMPLE_1))
      .then(() => {
        expect(store.getActions()).toEqual(selectRepoWithoutReadmeExpectedActions);
      });
  });

  test('select repository actions without readme', () => {
    const stateAfterSelect =
      repositoryReducer(STATE_WITH_1_LOADED_REPO, selectRepoWithoutReadmeExpectedActions[0]);
    expect(stateAfterSelect).toEqual({
      ...STATE_WITH_1_LOADED_REPO,
      displayedRepository: {
        ...REPO_EXAMPLE_1,
        fetchingReadme: true,
      },
    });

    const stateAfterReceive =
      repositoryReducer(stateAfterSelect, selectRepoWithoutReadmeExpectedActions[1]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterSelect,
      displayedRepository: {
        ...REPO_EXAMPLE_1,
        fetchingReadme: false,
        readme: null,
        readmeError: 'Not Found',
      },
    });
  });
});

describe('all most starred async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const searchMostStarredExpectedActionsWithResults = [
    {
      type: REQUEST_PAGE,
      query: '',
      page: 1,
      wipeResults: false,
    },
    {
      type: RECEIVE_PAGE,
      query: '',
      page: 1,
      error: null,
      repos: PAGE_EXAMPLE,
    },
  ];

  test('get all most starred dispatch with results', () => {
    const store = mockStore({ repositoryReducer: initialState });
    fetchMock.getOnce(`${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
      q: DEFAULT_QUERY,
      sort: 'stars',
      page: 1,
    })}`, {
      body: RAW_PAGE_EXAMPLE,
    });

    return store.dispatch(fetchPageIfNeeded('', 0))
      .then(() => {
        expect(store.getActions()).toEqual(searchMostStarredExpectedActionsWithResults);
      });
  });

  test('unneeded fetch dispatch', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    expect(store.dispatch(fetchPageIfNeeded('', 1))).toBeNull();
  });

  test('get all most starred actions with results', () => {
    const stateAfterRequest =
      repositoryReducer(initialState, searchMostStarredExpectedActionsWithResults[0]);
    expect(stateAfterRequest).toEqual({
      ...initialState,
      page: 1,
      fetching: true,
    });

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, searchMostStarredExpectedActionsWithResults[1]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      error: null,
      fetching: false,
      loadedRepositories: [PAGE_EXAMPLE],
    });
  });
});

describe('search async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  const searchExpectedActionsWithErrors = [
    {
      type: REQUEST_PAGE,
      query: 'search_terms',
      page: 1,
      wipeResults: true,
    },
    {
      type: RECEIVE_PAGE,
      query: 'search_terms',
      page: 1,
      error: 'some_error',
      repos: null,
    },
  ];

  test('search dispatch with errors', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    fetchMock.getOnce(`${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
      q: 'search_terms',
      sort: 'stars',
      page: 1,
    })}`, {
      body: {
        errors: [],
        message: 'some_error',
      },
    });

    return store.dispatch(fetchPageIfNeeded('search_terms', 1))
      .then(() => {
        expect(store.getActions()).toEqual(searchExpectedActionsWithErrors);
      });
  });

  test('search receive page action with errors', () => {
    const stateAfterRequest = {
      ...initialState,
      query: 'search_terms',
      page: 1,
      fetching: true,
    };

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, searchExpectedActionsWithErrors[1]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      error: 'some_error',
      fetching: false,
    });
  });

  const searchMostStarredExpectedActionsWithoutResults = [
    {
      type: REQUEST_PAGE,
      query: 'search_terms',
      page: 1,
      wipeResults: true,
    },
    {
      type: RECEIVE_PAGE,
      query: 'search_terms',
      page: 1,
      error: null,
      repos: [],
    },
  ];

  test('search most starred dispatch without results', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_REPO });
    fetchMock.getOnce(`${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
      q: 'search_terms',
      sort: 'stars',
      page: 1,
    })}`, {
      body: EMPTY_RAW_PAGE_EXAMPLE,
    });

    return store.dispatch(fetchPageIfNeeded('search_terms', 1))
      .then(() => {
        expect(store.getActions()).toEqual(searchMostStarredExpectedActionsWithoutResults);
      });
  });

  test('search receive page action for old query', () => {
    const stateAfterRequest = {
      ...initialState,
      query: 'new_search_terms',
      page: 1,
      fetching: true,
    };

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, searchMostStarredExpectedActionsWithoutResults[1]);
    expect(stateAfterReceive).toEqual(stateAfterRequest);
  });

  test('search most starred actions without results', () => {
    const stateAfterRequest = repositoryReducer(
      STATE_WITH_1_LOADED_REPO,
      searchMostStarredExpectedActionsWithoutResults[0]
    );
    expect(stateAfterRequest).toEqual({
      ...STATE_WITH_1_LOADED_REPO,
      query: 'search_terms',
      page: 1,
      fetching: true,
      loadedRepositories: [],
    });

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, searchMostStarredExpectedActionsWithoutResults[1]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      error: null,
      hasReachedFinalPage: true,
      fetching: false,
    });
  });
});

describe('fetch bookmarks async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
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
    const store = mockStore({ repositoryReducer: STATE_WITH_BOOKMARKED_REPOS_TO_FETCH });
    fetchMock.getOnce(REPO_URL_EXAMPLE_2, { body: RAW_REPO_EXAMPLE_2 });
    fetchMock.getOnce(REPO_URL_EXAMPLE_3, { body: RAW_REPO_EXAMPLE_3 });

    return store.dispatch(fetchBookmarksIfNeeded())
      .then(() => {
        expect(store.getActions()).toEqual(getBookmarksExpectedActions);
      });
  });

  test('get bookmarks already loaded dispatch 1', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_LOADED_BOOKMARK });
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarks already loaded dispatch 2', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED });
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarks already loaded dispatch 3', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_1_BOOKMARKED_REPO_TO_FETCH });
    expect(store.dispatch(fetchBookmarksIfNeeded())).toBeNull();
  });

  test('get bookmarked repositories actions', () => {
    const stateAfterUpdate =
      repositoryReducer(STATE_WITH_BOOKMARKED_REPOS_TO_FETCH, getBookmarksExpectedActions[0]);
    expect(stateAfterUpdate).toEqual({
      ...STATE_WITH_BOOKMARKED_REPOS_TO_FETCH,
      bookmarkedRepositories: [REPO_EXAMPLE_1],
    });

    const stateAfterRequest =
      repositoryReducer(stateAfterUpdate, getBookmarksExpectedActions[1]);
    expect(stateAfterRequest).toEqual({
      ...stateAfterUpdate,
      fetchingBookmarks: true,
    });

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, getBookmarksExpectedActions[2]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      bookmarkError: null,
      fetchingBookmarks: false,
      bookmarkedRepositories: PAGE_EXAMPLE,
    });
  });

  test('get bookmarks and receive unbookmarked repos action', () => {
    const stateAfterReceive =
      repositoryReducer(STATE_WITH_1_LOADED_BOOKMARK, getBookmarksExpectedActions[2]);
    expect(stateAfterReceive).toEqual({
      ...STATE_WITH_1_LOADED_BOOKMARK,
      fetchingBookmarks: false,
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
      ...STATE_WITH_BOOKMARKED_REPOS_TO_FETCH,
      bookmarkedRepositories: [REPO_EXAMPLE_1],
      fetchingBookmarks: true,
    };

    const stateAfterReceive =
      repositoryReducer(stateAfterRequest, getBookmarksExpectedActionsWithError[2]);
    expect(stateAfterReceive).toEqual({
      ...stateAfterRequest,
      fetchingBookmarks: false,
      bookmarkError: 'some_error',
    });
  });

  test('get bookmarked repositories dispatch with errors', () => {
    const store = mockStore({ repositoryReducer: STATE_WITH_BOOKMARKED_REPOS_TO_FETCH });
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
