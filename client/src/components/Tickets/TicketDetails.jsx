import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setCurrentTicketEntry } from '../../actions/setCurrentTicketEntry';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import { setCurrentTicketTenantData } from '../../actions/setCurrentTicketTenantData';
import TenantTicketDetails from './TenantTicketDetails.jsx';
import axios from 'axios';

class TicketDetails extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount () {
    //if manager, need to query for tenant's user info to display on ticket
    //add redis memcache for this tenant data after query once?
    if (localStorage.getItem('type') === '1') {
      const { data } = await axios.get(`http://localhost:3396/api/users/fetch/${this.props.currentTicketEntry.userid}`);
      await this.props.setCurrentTicketTenantData(data);
    }
  }

  onCancelHandler() {
    this.props.setTicketEditState('list');
  }

  render() {
    return (
      <div>
        subject: {this.props.currentTicketEntry.subject} <br/>
        category: {this.props.currentTicketEntry.category} <br/>
        description: {this.props.currentTicketEntry.description} <br/>
        Provided Photo: {this.props.currentTicketEntry.photo_url} <br/>
        <img src={this.props.currentTicketEntry.photo_url}/>
        {localStorage.getItem('type') === '0' || this.props.currentTicketTenantData ? 
          <TenantTicketDetails/>
          :
          null
          }
        <button onClick={this.onCancelHandler.bind(this)}>Back</button> 

        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData:state.userData,
    ticketsData: state.ticketsData,
    ticketEditState: state.ticketEditState,
    currentTicketEntry: state.currentTicketEntry,
    currentTicketTenantData: state.currentTicketTenantData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentTicketEntry: setCurrentTicketEntry,
    setTicketsData: setTicketsData,
    setTicketEditState: setTicketEditState,
    setCurrentTicketTenantData: setCurrentTicketTenantData
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(TicketDetails));
