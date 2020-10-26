import { createStore, combineReducers } from 'redux';
import repositoryReducer from '../reducers/repositoryReducer';

const rootReducer = combineReducers({
  reducer: repositoryReducer,
});

const initStore = () => createStore(rootReducer);

export default initStore;
