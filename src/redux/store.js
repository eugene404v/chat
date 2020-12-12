import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import institutionReducer from './reducers/institution';
import childByInst from './reducers/childByInst';
import childReducer from './reducers/childReducer'
import parentReducer from './reducers/parentReducer'
import specialistReducer from './reducers/specialistReducer'
import familyReducer from './reducers/familyReducer'
import newsReducer from './reducers/newsReducer'
import userReducer from './reducers/userReducer'
import documentsReducer from './reducers/documentsReducer'
import archiveReducer from './reducers/archiveReducer'
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  institutionReducer,
  childByInst,
  childReducer,
  parentReducer,
  specialistReducer,
  familyReducer,
  newsReducer,
  userReducer,
  documentsReducer,
  archiveReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
  );



export default store;