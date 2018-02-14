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
    this.state = {
      tenantInfoError: false
    };
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount () {
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    //if manager, need to query for tenant's user info to display on ticket
    try {
      if (localStorage.getItem('type') === '1') {
        const { data } = await axios.get(`${this.REST_URL}/api/users/fetch/${this.props.currentTicketEntry.userid}`, this.config);
        await this.props.setCurrentTicketTenantData(data);
        this.setState({tenantInfoError: false});
      }
    } catch (err) {
      this.setState({tenantInfoError: true});
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
        { this.state.tenantInfoError ? <div>Error loading tenant details, please try again!</div> : null }
        <button onClick={this.onCancelHandler.bind(this)}>Back</button> 

        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, matchDispatchToProps)(TicketDetails);
