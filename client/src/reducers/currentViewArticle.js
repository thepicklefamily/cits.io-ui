export default (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_VIEW_ARTICLE_SELECTOR':
      return action.payload;
      break;
  }
  return state;
};  