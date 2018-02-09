export default (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_ARTICLE_POSTS_SELECTOR':
      return action.payload;
      break;
  }
  return state;
};