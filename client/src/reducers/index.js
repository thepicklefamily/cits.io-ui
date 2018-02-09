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
import ticketsData from './ticketsData';
import ticketEditState from './ticketEditState';
import currentTicketEntry from './currentTicketEntry';
import currentTicketTenantData from './currentTicketTenantData';
import currentViewArticle from './currentViewArticle';
import currentArticlePosts from './currentArticlePosts';

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
  currentProperty,
  ticketsData,
  ticketEditState,
  currentTicketEntry,
  currentTicketTenantData,
  currentViewArticle,
  currentArticlePosts
});

export default allReducers;