export default function (state='preview', action) {
  switch (action.type) {
    case 'SET_TICKET_EDIT_STATE_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}