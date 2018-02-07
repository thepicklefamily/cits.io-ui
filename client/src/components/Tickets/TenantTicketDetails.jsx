import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setCurrentTicketEntry } from '../../actions/setCurrentTicketEntry';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import { setCurrentTicketTenantData } from '../../actions/setCurrentTicketTenantData';
import axios from 'axios';

class TenantTicketDetails extends Component {
  constructor(props) {
    super(props);
  }

  async onUpdateStatusHandler() {
    
    //update status

    this.props.setTicketEditState('list');
  }

  render() {
    return (
      <div>
        TENANT  <br/>
        {this.props.userData.type === 0 ? 
          <div>
              Name: {this.props.userData.fullName}  <br/>
              Apt. Num: WE DONT HAVE THIS YET  <br/>
              Phone Number: {this.props.userData.phonenumber}  <br/>
              Email: {this.props.userData.email}  <br/>
              Status: {this.props.currentTicketEntry.status}  <br/>
            </div>
          :
          <div>
            Name: {this.props.currentTicketTenantData[0].full_name}  <br/>
            Apt. Num: WE DONT HAVE THIS YET  <br/>
            Phone Number: {this.props.currentTicketTenantData[0].phonenumber}  <br/>
            Email: {this.props.currentTicketTenantData[0].email}  <br/>
            Status: {this.props.currentTicketEntry.status}  <br/>
            <button onClick={this.onUpdateStatusHandler.bind(this)}>Save</button>
          </div>
          }
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

export default (connect(mapStateToProps, matchDispatchToProps)(TenantTicketDetails));