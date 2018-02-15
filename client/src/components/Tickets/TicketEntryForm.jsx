import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import axios from 'axios';
import moment from 'moment';

class TicketEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      managerEmails: [],
      ticketError: false
    };
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.SMTP_URL = (process.env.NODE_ENV === 'production') ? process.env.SMTP_SERVER_AWS_HOST : process.env.SMTP_SERVER_LOCAL_HOST;
  }

  async componentDidMount () {
    try {
      this.config.headers.authorization = localStorage.getItem('token');
      //this prepopulates the apt number in the ticket submission form:
      const { data } = await axios.get(`${this.REST_URL}/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);
      for (let i = 0; i < data.length; i++) {
        data[i].id.toString() === localStorage.getItem('propertyId') ? document.getElementsByName('apt_num')[0].innerHTML = `Your Apartment #: ${data[i].unit}` : null;
      } 
      const emails = await axios.get(`${this.REST_URL}/api/usersPropertiesAptUnits/getUsersPropertiesManagers?propertyID=${localStorage.getItem('propertyId')}`, this.config);
      await this.setState({
        managerEmails: emails.data
      })
      console.log(this.state);
    } catch (err) {
      //
    }
  }

  //change category to a dropdown of a handful of options, including Other
  async submitNewTicket () {
    const payload = {
      category: document.getElementsByName('category')[0].value,
      //once we have apt_num in table working properly, we could/should pre-populate it for the tenant
      apt_num: document.getElementsByName('apt_num')[0].value,
      subject: document.getElementsByName('subject')[0].value,
      description: document.getElementsByName('description')[0].value,
      photo_url: document.getElementsByName('photo_url')[0].value,
      status: 'Pending',
      userId: localStorage.getItem('id'),
      propertyId: localStorage.getItem('propertyId'),
      date: moment(new Date()).format('MMMM Do YYYY')
    };
    try {
      await axios.post(`${this.REST_URL}/api/tickets/create`, payload, this.config);
      
      //getting the new updated list of tickets for the user:
      const { data } = await axios.get(`http://localhost:3396/api/tenantTickets/fetch/${localStorage.getItem('id')}`, this.config);
      this.props.setTicketsData(data);
      //return back to list of entries view:
      const emailPayload = {
        name: localStorage.getItem('full_name'),
        email: localStorage.getItem('email'),
        phone: localStorage.getItem('phonenumber'),
        description: payload.description,
        subject: payload.subject,
        date: payload.date,
        category: payload.category,
        apt_num: payload.apt_num,
        managerEmails: this.state.managerEmails
      }
      await axios.post(`${this.SMTP_URL}/tickets/sendTicketEmail`, emailPayload, this.config)
      this.setState({ ticketError: false });
      this.props.setTicketEditState('list');
    }
    catch (err) {
      this.setState({ ticketError: true });
    }
  }

  render() {
    return (
      <div>
        <br/><br/>
        TICKET INFORMATION <br/><br/>
        <select name='category'>
          <option value="" hidden >Select a category...</option>
          <option value="plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Aesthetic">Aesthetic</option>
          <option value="Other">Other</option>
        </select>
        <br/><br/>
        <div name='apt_num'></div>
        <br/><br/>
        <input type='text' name='subject' placeholder='Subject'></input>
        <br/><br/>
        <textarea rows="4" cols="50" type='text' name='description' placeholder='Please describe the issue...'></textarea>
        <br/><br/>
        <textarea rows="2" cols="50" type='text' name='photo_url' placeholder='If you have a photo, provide url here'></textarea>
        <br/><br/>
        {this.state.ticketError ? <div className="ticketError">Please check your input fields and try again!</div> : null}
        <button onClick={this.submitNewTicket.bind(this)}>SUBMIT</button> 
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentProperty: state.currentProperty,
    ticketsData: state.ticketsData,
    ticketEditState: state.ticketEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setTicketsData: setTicketsData,
    setTicketEditState: setTicketEditState
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(TicketEntryForm);