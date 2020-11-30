import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import institutionReducer from './reducers/institution';
import childByInst from './reducers/childByInst';
import childReducer from './reducers/childReducer'
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  institutionReducer,
  childByInst,
  childReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
  );



export default store;