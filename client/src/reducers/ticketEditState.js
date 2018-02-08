export default function (state='list', action) {
  switch (action.type) {
    case 'SET_TICKET_EDIT_STATE_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}