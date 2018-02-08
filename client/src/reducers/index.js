import { combineReducers } from 'redux';
import userData from './userData';
import phonebookData from './phonebookData';
import phonebookEditState from './phonebookEditState';
import currentPhonebookEntry from './currentPhonebookEntry';
import profileEditState from './profileEditState';
import articlesData from "./articlesData";
import articleEditState from './articleEditState';
import currentArticleEntry from './currentArticleEntry';
import propertyData from './propertyData';
import currentProperty from './currentProperty';

const allReducers = combineReducers({
  userData,
  phonebookData,
  phonebookEditState,
  currentPhonebookEntry,
  profileEditState,
  articlesData,
  articleEditState,
  currentArticleEntry,
  propertyData,
  currentProperty
});

export default allReducers;
