import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setCurrentTicketEntry } from '../../actions/setCurrentTicketEntry';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import { setCurrentTicketTenantData } from '../../actions/setCurrentTicketTenantData';
import TenantTicketDetails from './TenantTicketDetails.jsx';
import axios from 'axios';
import './ticketstyles.css';

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
      <div className='detailsContainer centerContainer'>
        <div className='detailsLeft'>
          <div className='detailsubjphoto'>{this.props.currentTicketEntry.subject}</div>
          <div className='detailcategory'>{this.props.currentTicketEntry.category}</div>
          <div className='detaildescription'>{this.props.currentTicketEntry.description}</div>
          {this.props.currentTicketEntry.photo_url ? 
            <div><div className='detailsubjphoto'>Provided Photo:</div><img className='photo' src={this.props.currentTicketEntry.photo_url}/></div>
            :
            null
            }
        </div>
        <div className='detailsRight'>
        {localStorage.getItem('type') === '0' || this.props.currentTicketTenantData ? 
          <TenantTicketDetails/>
          :
          null
          }
        { this.state.tenantInfoError ? <div>Error loading tenant details, please try again!</div> : null }
        <button onClick={this.onCancelHandler.bind(this)}>Back</button> 
        </div>
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
