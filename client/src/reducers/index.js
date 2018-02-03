import {combineReducers} from 'redux';
import UserData from './userData';
import PhonebookData from './phonebookData';
import PhonebookEditState from './phonebookEditState';
import CurrentPhonebookEntry from './currentPhonebookEntry';
import ProfileEditState from './profileEditState';
import ArticlesData from "./articlesData";

const allReducers = combineReducers({
  userData:UserData,
  phonebookData:PhonebookData,
  phonebookEditState:PhonebookEditState,
  currentPhonebookEntry:CurrentPhonebookEntry,
  profileEditState:ProfileEditState,
  articlesData: ArticlesData
});

export default allReducers;
