import {combineReducers} from 'redux';
import UserData from './userData';

const allReducers = combineReducers({
  userData:UserData
});

export default allReducers;