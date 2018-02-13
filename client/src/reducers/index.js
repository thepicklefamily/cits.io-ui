import { combineReducers } from 'redux';
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
import searchResults from './searchResults';
import currentViewArticle from './currentViewArticle';
import currentArticlePosts from './currentArticlePosts';
import secretErrorState from './secretErrorState';

const allReducers = combineReducers({
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
  searchResults,
  currentViewArticle,
  currentArticlePosts,
  secretErrorState
});

export default allReducers;