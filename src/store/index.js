import { combineReducers } from 'redux';
import data from './reducers/data';
import activePet from './reducers/active-pet';

export default combineReducers({
  data,
  activePet
})
