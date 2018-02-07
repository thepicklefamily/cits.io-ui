import { combineReducers } from 'redux';
import UserData from './userData';
import PhonebookData from './phonebookData';
import PhonebookEditState from './phonebookEditState';
import CurrentPhonebookEntry from './currentPhonebookEntry';
import ProfileEditState from './profileEditState';
import ArticlesData from "./articlesData";
import ArticleEditState from './articleEditState';
import CurrentArticleEntry from './currentArticleEntry';
import PropertyData from './propertyData';
import CurrentProperty from './currentProperty';
import TicketsData from './ticketsData';
import TicketEditState from './ticketEditState';

const allReducers = combineReducers({
  userData:UserData,
  phonebookData:PhonebookData,
  phonebookEditState:PhonebookEditState,
  currentPhonebookEntry:CurrentPhonebookEntry,
  profileEditState:ProfileEditState,
  articlesData: ArticlesData, 
  articleEditState: ArticleEditState,
  currentArticleEntry: CurrentArticleEntry,
  ticketsData: TicketsData,
  propertyData: PropertyData,
  currentProperty: CurrentProperty,
  ticketEditState: TicketEditState
});

export default allReducers;