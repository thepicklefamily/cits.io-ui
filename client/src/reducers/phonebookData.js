export default function (state=null, action) {
  switch (action.type) {
    case 'SET_PHONEBOOK_DATA_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}