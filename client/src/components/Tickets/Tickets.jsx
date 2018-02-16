import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setTicketsData } from '../../actions/setTicketsData';
import { setTicketEditState } from '../../actions/setTicketEditState';
import TicketEntry from './TicketEntry.jsx';
import TicketEntryForm from './TicketEntryForm.jsx';
import TicketDetails from './TicketDetails.jsx';
import axios from 'axios';
import { locale } from 'moment';

import './ticketstyles2.css';

class Tickets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketsError: false
    };

    this.config = {
      headers: {
        authorization: ''
      }
    };

    this.onAddHandler = this.onAddHandler.bind(this);
    this.onCancelHandler = this.onCancelHandler.bind(this);
  }

  async componentWillMount () {
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    
    //if user is tenant, get tenant's tickets:
    try {
      if (localStorage.getItem('type') === '0') {
        const { data } = await axios.get(`${this.REST_URL}/api/tenantTickets/fetch/${localStorage.getItem('id')}`, this.config);
        this.props.setTicketsData(data);
      //if user is manager, get property's tickets:
      } else {
        const { data } = await axios.get(`${this.REST_URL}/api/propTickets/fetch/${localStorage.getItem('propertyId')}`, this.config);
        this.props.setTicketsData(data);
      }
      this.setState({ticketsError: false});
    } catch (err) {
      this.setState({ticketsError: true});
    }
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
        {
          this.props.ticketEditState === 'list' ? 
          <h5 className="title">SUBMITTED TICKETS</h5>
          : null
        }
        <div className='container'>
          <div>
            {
              localStorage.getItem('type') === '0' && this.props.ticketEditState === 'list' ? 
              <button onClick={this.onAddHandler} className='submitbutton'>Submit New Ticket</button> 
              : null
            }
          </div>

          <div>
            {
              this.props.ticketEditState === 'create' ? 
              <div>
                <TicketEntryForm />
                <button onClick={this.onCancelHandler}>Cancel</button>
              </div>
              : null
            }
          </div>
          
          {
            this.props.ticketEditState === 'details' ? 
            <TicketDetails />
            : null
          }

          {
            this.props.ticketEditState === 'list' ? 
            <div className='entriesContainer'>
              {
                this.props.ticketsData && this.props.ticketsData.length ? 
                this.props.ticketsData.map(ticket => <TicketEntry key={ticket.id} data={ticket} />)
                : 'There are no tickets.'
              }
            </div>
            : null
          }

          {
            this.state.ticketsError ? 
            <div>Oops! There was an issue with loading your tickets. Please try again!</div> 
            : null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, matchDispatchToProps)(Tickets);