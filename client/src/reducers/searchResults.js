export default function (state=[], action) {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return action.payload;
      break;
  }
  return state;
}