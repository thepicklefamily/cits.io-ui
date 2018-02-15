import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import axios from 'axios';
import { locale } from 'moment';
import './ticketstyles.css';

class TenantTicketDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusUpdateError: false
    };
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }
  
  componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.config.headers.authorization = localStorage.getItem('token');
  }

  async onUpdateStatusHandler() {
    //manager updates status:
    var payload = this.props.currentTicketEntry;
    try {
      payload.status = document.getElementsByName('status')[0].value,
      await axios.put(`${this.REST_URL}/api/userTickets/edit`, payload, this.config);
      this.setState({statusUpdateError: false});
      //getting the new updated list of tickets for the property:
      const { data } = await axios.get(`${this.REST_URL}/api/propTickets/fetch/${localStorage.getItem('propertyId')}`, this.config);
      this.props.setTicketsData(data);
      //return back to list of entries view:
      this.props.setTicketEditState('list');
    } catch (err) {
      this.setState({statusUpdateError: true});
    }
  }

  render() {
    return (
      <div>
        TENANT  <br/>
        {localStorage.getItem('type') === '0' ? 
          <div>
              Name: {localStorage.getItem('full_name')}  <br/>
              Apt. Num: {this.props.currentTicketEntry.apt_num}  <br/>
              Phone Number: {localStorage.getItem('phonenumber')}  <br/>
              Email: {localStorage.getItem('email')}  <br/>
              Status: {this.props.currentTicketEntry.status}  <br/>
            </div>
          :
          <div>
            Name: {this.props.currentTicketTenantData[0].full_name}  <br/>
            Apt. Num: {this.props.currentTicketEntry.apt_num}  <br/>
            Phone Number: {this.props.currentTicketTenantData[0].phonenumber}  <br/>
            Email: {this.props.currentTicketTenantData[0].email}  <br/>
            Status:
            <select name='status' defaultValue={this.props.currentTicketEntry.status}>
                <option value='Pending' >Pending</option>
                <option value='In-Progress' >In-Progress</option>
                <option value='Complete' >Complete</option>
            </select>
            { this.state.statusUpdateError ? <div >Error updating status. Please try again!</div> : null }
            <br/>
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
    currentProperty: state.currentProperty,
    currentTicketEntry: state.currentTicketEntry,
    currentTicketTenantData: state.currentTicketTenantData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setTicketsData: setTicketsData,
    setTicketEditState: setTicketEditState,
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(TenantTicketDetails);