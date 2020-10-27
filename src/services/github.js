import queryString from 'query-string';

const API_URL = 'https://api.github.com';
const SEARCH_ROUTE = '/search/repositories';

const getReposByStarsRoute = (q, page) =>
  `${API_URL}${SEARCH_ROUTE}?${queryString.stringify({
    q,
    sort: 'stars',
    page,
  })}`;

export const fetchMostStarred = async (query, page) => {
  if (!Boolean(query)) {
    query = 'stars:>=1000';
  }
  const URL = getReposByStarsRoute(query, page);
  const res = await fetch(URL);
  const json = await res.json();
  if ('errors' in json) {
    console.error(JSON.stringify(json.errors));
    return Promise.reject(json.message);
  }
  return json.items.map(({ id, full_name, description, stargazers_count, owner }) =>
    ({
      id,
      name: full_name,
      description,
      stars: stargazers_count,
      avatar_url: owner.avatar_url,
    })
  );
};
