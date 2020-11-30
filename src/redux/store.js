import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import institutionReducer from './reducers/institution';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  institutionReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
  );



export default store;