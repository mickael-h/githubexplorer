import { decode as decodeB64 } from 'base-64';
import { decode as decodeUTF8 } from 'utf8';
import { initialState } from '../reducers/repositoryReducer';

export const REPO_URL_EXAMPLE_1 = 'https://api.github.com/repos/mickael-h/colorpicker';
export const REPO_URL_EXAMPLE_2 = 'https://api.github.com/repos/mickael-h/bus_guide';
export const REPO_URL_EXAMPLE_3 = 'https://api.github.com/repos/mickael-h/spotifyviewer';

const RAW_REPO_EXAMPLE_1 = Object.freeze({
  url: REPO_URL_EXAMPLE_1,
  html_url: 'https://github.com/mickael-h/colorpicker',
  full_name: 'mickael-h/colorpicker',
  description: 'A short description',
  stargazers_count: 10000,
  language: 'JavaScript',
  owner: {
    avatar_url: 'https://avatars2.githubusercontent.com/u/7953005?v=4',
  },
});

const LONG_DESCRIPTION =
  'A description longer than 300 characters---------------------------1'
  + '-----------------------------------------------------------------2'
  + '-----------------------------------------------------------------3'
  + '-----------------------------------------------------------------4'
  + '-----------------------------------------------------------------5';

export const RAW_REPO_EXAMPLE_2 = Object.freeze({
  ...RAW_REPO_EXAMPLE_1,
  url: REPO_URL_EXAMPLE_2,
  description: LONG_DESCRIPTION,
});

export const RAW_REPO_EXAMPLE_3 = Object.freeze({
  ...RAW_REPO_EXAMPLE_1,
  url: REPO_URL_EXAMPLE_3,
});

export const REPO_EXAMPLE_1 = Object.freeze({
  url: RAW_REPO_EXAMPLE_1.url,
  htmlUrl: RAW_REPO_EXAMPLE_1.html_url,
  name: RAW_REPO_EXAMPLE_1.full_name,
  description: RAW_REPO_EXAMPLE_1.description,
  stars: RAW_REPO_EXAMPLE_1.stargazers_count,
  language: RAW_REPO_EXAMPLE_1.language,
  avatarUrl: RAW_REPO_EXAMPLE_1.owner.avatar_url,
});

export const REPO_EXAMPLE_2 = Object.freeze({
  ...REPO_EXAMPLE_1,
  url: REPO_URL_EXAMPLE_2,
  description: `${LONG_DESCRIPTION.substr(0, 300)}...`,
});

export const REPO_EXAMPLE_3 = Object.freeze({
  ...REPO_EXAMPLE_1,
  url: REPO_URL_EXAMPLE_3,
});

export const PAGE_EXAMPLE = Object.freeze([
  REPO_EXAMPLE_1,
  REPO_EXAMPLE_2,
  REPO_EXAMPLE_3,
]);

export const RAW_PAGE_EXAMPLE = Object.freeze({
  items: [
    RAW_REPO_EXAMPLE_1,
    RAW_REPO_EXAMPLE_2,
    RAW_REPO_EXAMPLE_3,
  ],
});

export const EMPTY_RAW_PAGE_EXAMPLE = Object.freeze({
  items: [],
});

export const ENCODED_README = 'IyBjb2xvcnBpY2tlcgpBIHNpbXBsZSBjb2xvciBwaWNrZXIgYXBwIGluI'
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

export const DECODED_README = decodeUTF8(decodeB64(ENCODED_README));
export const STATE_WITH_1_LOADED_REPO = Object.freeze({
  ...initialState,
  page: 1,
  loadedRepositories: [[REPO_EXAMPLE_1]],
});

export const STATE_WITH_DISPLAYED_REPO = Object.freeze({
  ...initialState,
  displayedRepository: REPO_EXAMPLE_1,
});

export const STATE_WITH_BOOKMARKED_REPOS_TO_FETCH = Object.freeze({
  ...STATE_WITH_1_LOADED_REPO,
  bookmarkedURLs: [
    REPO_URL_EXAMPLE_1,
    REPO_URL_EXAMPLE_2,
    REPO_URL_EXAMPLE_3,
  ],
});

export const STATE_WITH_1_LOADED_BOOKMARK = Object.freeze({
  ...STATE_WITH_1_LOADED_REPO,
  bookmarkedURLs: [REPO_URL_EXAMPLE_1],
});

export const STATE_WITH_BOOKMARK_NO_UPDATE_NEEDED = Object.freeze({
  ...STATE_WITH_1_LOADED_REPO,
  bookmarkedURLs: [REPO_URL_EXAMPLE_1],
  bookmarkedRepositories: [REPO_EXAMPLE_1],
});

export const STATE_WITH_1_BOOKMARKED_REPO_TO_FETCH = Object.freeze({
  ...STATE_WITH_1_LOADED_REPO,
  bookmarkedURLs: [REPO_URL_EXAMPLE_2],
  bookmarkedRepositories: [REPO_EXAMPLE_2],
});
