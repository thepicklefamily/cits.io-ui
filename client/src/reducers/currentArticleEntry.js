export default function (state=null, action) {
  switch (action.type) {
    case 'SET_CURRENT_ARTICLE_ENTRY_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}