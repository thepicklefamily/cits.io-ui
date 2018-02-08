import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setTicketsData } from '../../actions/setTicketsData';
import { setTicketEditState } from '../../actions/setTicketEditState';
import TicketEntry from './TicketEntry.jsx';
import TicketEntryForm from './TicketEntryForm.jsx';
import TicketDetails from './TicketDetails.jsx';
import axios from 'axios';

class Tickets extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount () {
    //if user is tenant, get tenant's tickets:
      // var tickets;
    if (this.props.userData.type === 0) {
      const { data } = await axios.get(`http://localhost:3396/api/tenantTickets/fetch/${this.props.userData.id}`);
      this.props.setTicketsData(data);
    //if user is manager, get property's tickets:
    } else {
      const { data } = await axios.get(`http://localhost:3396/api/propTickets/fetch/${this.props.currentProperty.id}`);
      this.props.setTicketsData(data);
    }
  
    //states want:
    //ticketData: array of retrieved tickets
    //currentTicketEntry: one looking at for details/update states
    //ticketEditState: if they click edit or add new entry (on top), should change
        //'list' (list view)
        //'details' (details on 1 for tenant / details + update status for mgr
        // 'create' - tenant only

  }

  onAddHandler() {
    this.props.setTicketEditState('create');
  }

  onCancelHandler() {
    this.props.setTicketEditState('list');
  }

  render() {
    return (
      <div>
        <div>{this.props.userData.type === 0 && this.props.ticketEditState === 'list' ? 
          <button onClick={this.onAddHandler.bind(this)}>SUBMIT NEW TICKET</button> 
          : 
          null
          }
        </div>
        <div>{this.props.ticketEditState === 'create' ? 
          <div><TicketEntryForm/>
          <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button></div>
          : 
          null
          }
        </div>
        <br/><br/>
        
        {this.props.ticketEditState === 'details' ? 
          <TicketDetails/>
          :
          null
          }


        {this.props.ticketEditState === 'list' ? 
          <div>SUBMITTED TICKETS:
          <br/><br/>
          <div>
            {this.props.ticketsData ? 
              this.props.ticketsData.map(ticket => <TicketEntry key={ticket.id} data={ticket}/>)
              :
              'There are no tickets.'
              }
          </div>
          </div>
          :
          null
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    currentProperty: state.currentProperty,
    ticketsData: state.ticketsData,
    ticketEditState: state.ticketEditState,
    currentTicketEntry: state.CurrentTicketEntry
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setTicketsData: setTicketsData,
    setTicketEditState: setTicketEditState
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Tickets));