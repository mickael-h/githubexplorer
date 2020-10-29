import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import repositoryReducer from '../reducers/repositoryReducer';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
  repositoryReducer,
});

const configureStore = () => createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware),
);

export const configureStoreNoLogs = () => createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware),
);

export default configureStore;
