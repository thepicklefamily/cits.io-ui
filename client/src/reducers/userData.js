export default function (state=null, action) {
  switch (action.type) {
    case 'SET_USER_DATA_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}