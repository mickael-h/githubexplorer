import {
  SET_LANGUAGE,
} from '../actions/types';

export const initialState = {
  texts: {},
};

const localeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return setLanguage(state, action);
    default:
      return state;
  }
};

const setLanguage = (state, { texts }) => ({
  texts,
});


export default localeReducer;
