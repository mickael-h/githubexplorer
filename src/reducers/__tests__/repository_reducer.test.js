import queryString from 'query-string';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock-jest';
import repositoryReducer, { initialState as repoInitState } from '../repositoryReducer';
import {
  README_ROUTE,
  API_URL,
  SEARCH_ROUTE,
  DEFAULT_QUERY,
} from '../../services/github';
import {
  RECEIVE_PAGE,
  RECEIVE_README,
  REQUEST_PAGE,
  SELECT_REPO,
} from '../../actions/types';
import {
  setDisplayedRepo,
  fetchPageIfNeeded,
} from '../../actions/repositoryActions';
import {
  STATE_WITH_DISPLAYED_REPO,
  REPO_URL_EXAMPLE_1,
  REPO_EXAMPLE_1,
  PAGE_EXAMPLE,
  RAW_PAGE_EXAMPLE,
  EMPTY_RAW_PAGE,
  ENCODED_README,
  INITIAL_STATE,
  DECODED_README,
  STATE_WITH_1_LOADED_REPO,
} from '../../data_examples';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('sync unit tests', () => {
  test('wrong action and undefined state', () => {
    const newState = repositoryReducer(undefined, { type: 'wrong type' });
    expect(newState).toBe(repoInitState);
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
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
    const store = mockStore(STATE_WITH_DISPLAYED_REPO);
    expect(store.dispatch(setDisplayedRepo(REPO_EXAMPLE_1))).toBeNull();
  });

  test('select repository actions with readme', () => {
    const stateAfterSelect =
      repositoryReducer(
        STATE_WITH_1_LOADED_REPO.repositoryReducer,
        selectRepoWithReadmeExpectedActions[0]
      );
    expect(stateAfterSelect).toEqual({
      ...STATE_WITH_1_LOADED_REPO.repositoryReducer,
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
      repositoryReducer(repoInitState, selectRepoWithReadmeExpectedActions[1]);
    expect(stateAfterReceive).toEqual(repoInitState);
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
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
      repositoryReducer(
        STATE_WITH_1_LOADED_REPO.repositoryReducer,
        selectRepoWithoutReadmeExpectedActions[0]
      );
    expect(stateAfterSelect).toEqual({
      ...STATE_WITH_1_LOADED_REPO.repositoryReducer,
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
    const store = mockStore(INITIAL_STATE);
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
    expect(store.dispatch(fetchPageIfNeeded('', 1))).toBeNull();
  });

  test('get all most starred actions with results', () => {
    const stateAfterRequest =
      repositoryReducer(repoInitState, searchMostStarredExpectedActionsWithResults[0]);
    expect(stateAfterRequest).toEqual({
      ...repoInitState,
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
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

  test('search dispatch with API limit reached', () => {
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
    fetchMock.getOnce(`${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
      q: 'search_terms',
      sort: 'stars',
      page: 1,
    })}`, {
      body: {
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
      ...repoInitState,
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
    const store = mockStore(STATE_WITH_1_LOADED_REPO);
    fetchMock.getOnce(`${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
      q: 'search_terms',
      sort: 'stars',
      page: 1,
    })}`, {
      body: EMPTY_RAW_PAGE,
    });

    return store.dispatch(fetchPageIfNeeded('search_terms', 1))
      .then(() => {
        expect(store.getActions()).toEqual(searchMostStarredExpectedActionsWithoutResults);
      });
  });

  test('search receive page action for old query', () => {
    const stateAfterRequest = {
      ...repoInitState,
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
      STATE_WITH_1_LOADED_REPO.repositoryReducer,
      searchMostStarredExpectedActionsWithoutResults[0]
    );
    expect(stateAfterRequest).toEqual({
      ...STATE_WITH_1_LOADED_REPO.repositoryReducer,
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
