import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock-jest';
import { decode as decodeB64 } from 'base-64';
import { decode as decodeUTF8 } from 'utf8';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import repositoryReducer, { initialState } from '../repositoryReducer';
import {
  RECEIVE_README,
  SELECT_REPO,
} from '../../actions/types';
import {
  bookmarkRepo,
  removeBookmark,
  setDisplayedRepo,
  fetchPageIfNeeded,
  fetchBookmarksIfNeeded,
} from '../../actions/repository';

const REPO_EXAMPLE = Object.freeze({
  url: 'https://api.github.com/repos/mickael-h/colorpicker',
  htmlUrl: 'https://github.com/mickael-h/colorpicker',
  name: 'mickael-h/colorpicker',
  description: 'A short description',
  stars: 10000,
  language: 'JavaScript',
  avatarUrl: 'https://avatars2.githubusercontent.com/u/7953005?v=4',
});

const ENCODED_README = 'IyBjb2xvcnBpY2tlcgpBIHNpbXBsZSBjb2xvciBwaWNrZXIgYXBwIGluI'
  + 'FJl\nYWN0IE5hdGl2ZS4KCiMjIFN0YXRlIE1hbmFnZW1lbnQgYW5kIEFyY2hpdGVj\ndHVyZQpJIH'
  + 'VzZWQgdGhlIENvbnRleHQgQVBJIGFsb25nIHdpdGggdGhlIHVz\nZUNvbnRleHQgYW5kIHVzZVJlZ'
  + 'HVjZXIgaG9va3MgdG8gc2VwYXJhdGUgdGhl\nIHZpZXdzIGZyb20gdGhlIGJ1c2luZXNzIGxvZ2lj'
  + 'LgpFYWNoIHJlZHVjZXIg\naGFzIGl0cyBvd24gZmlsZSBpbiB3aGljaCB0aGUgYnVzaW5lc3MgbG9'
  + 'naWMg\nZm9yIHRoYXQgcGFydGljdWxhciBzdGF0ZSBpcyBzdG9yZWQuCgojIyBUZXN0\ncwpJIG1h'
  + 'ZGUgdGhpcyBhcHAgbWFpbmx5IHRvIHRyeSBUZXN0IERyaXZlbiBE\nZXZlbG9wbWVudCB3aXRoIHR'
  + 'oZSBDb250ZXh0IEFQSS4KSXQgd2Fzbid0IHRo\nYXQgaGFyZCB0byBkbyBvbiB0aGUgcmVkdWNlcn'
  + 'MsIGJ1dCBJIGhhZCB0byBk\nbyBzb21lIGJhY2sgYW5kIGZvcnRoIHdpdGggdGhlIGNvbXBvbmVud'
  + 'HMnIHRl\nc3QsIG1haW5seSB0byByZXRyaWV2ZSB0aGUgY29ycmVjdCBjb21wb25lbnRz\nIGFuZC'
  + 'B0aGVpciBwcm9wcy4KQWxzbyBJIHRyaWVkIHRvIHJlZnJhaW4gZnJv\nbSBwdXR0aW5nIHRlc3QgS'
  + 'URzIGV2ZXJ5d2hlcmUuCg==\n';

const DECODED_README = decodeUTF8(decodeB64(ENCODED_README));

describe('repositoryReducer sync unit tests', () => {
  test('addBookmark', () => {
    const newState = repositoryReducer(initialState, bookmarkRepo(REPO_EXAMPLE.url));
    expect(newState.bookmarkedURLs).toHaveLength(1);
    expect(newState.bookmarkedURLs[0]).toEqual(REPO_EXAMPLE.url);
  });

  test('removeBookmark', () => {
    const state = {
      ...initialState,
      bookmarkedURLs: [REPO_EXAMPLE.url],
    };
    const newState = repositoryReducer(state, removeBookmark(REPO_EXAMPLE.url));
    expect(newState.bookmarkedURLs).toHaveLength(0);
  });

  test('wrong action', () => {
    const newState = repositoryReducer(initialState, { type: 'wrong type' });
    expect(newState).toBe(initialState);
  });
});


describe('repositoryReducer async unit tests', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test('selectRepo', () => {
    const state = {
      ...initialState,
      loadedRepositories: [[
        REPO_EXAMPLE,
      ]],
    };
    const store = mockStore({ repositoryReducer: state });

    fetchMock.getOnce(REPO_EXAMPLE.url + '/contents/README.md', {
      body: {
        encoding: 'base64',
        content: ENCODED_README,
      },
      //headers: { 'content-type': 'application/json' },
    });

    const expectedActions = [
      {
        type: SELECT_REPO,
        repo: REPO_EXAMPLE,
      },
      {
        type: RECEIVE_README,
        repoUrl: REPO_EXAMPLE.url,
        readme: DECODED_README,
        readmeError: null,
      },
    ];

    return store.dispatch(setDisplayedRepo(REPO_EXAMPLE))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('requestPage', () => {
    const callback = fetchPageIfNeeded();
    //const dispatch = ;
  });

  test('receivePage', () => {
    const callback = fetchBookmarksIfNeeded();
    //const dispatch = ;
  });
});
