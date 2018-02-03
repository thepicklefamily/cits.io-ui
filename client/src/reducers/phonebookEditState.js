export default function (state=null, action) {
  switch (action.type) {
    case 'SET_PHONEBOOK_EDIT_STATE_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}