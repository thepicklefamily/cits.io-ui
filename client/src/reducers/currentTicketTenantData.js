export default function (state=null, action) {
  switch (action.type) {
    case 'SET_CURRENT_TICKET_TENANT_DATA_SELECTOR':
      return action.payload;
      break;
  }
  return state;
}