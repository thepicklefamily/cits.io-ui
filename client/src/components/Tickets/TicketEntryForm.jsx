import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import axios from 'axios';

class TicketEntryForm extends Component {
  constructor(props) {
    super(props);
  }


  //change category to a dropdown of a handful of options, including Other

  async submitNewTicket () {
    const payload = {
      category: document.getElementsByName('category')[0].value,
      apt_num: document.getElementsByName('apt_num')[0].value,
      subject: document.getElementsByName('subject')[0].value,
      description: document.getElementsByName('description')[0].value,
      photo_url: document.getElementsByName('photo_url')[0].value,
      status: 'Pending',
      userId: this.props.userData.id,
      propertyId: this.props.currentProperty.id,
      date: (new Date()).toString()
    };
    await axios.post('http://localhost:3396/api/tickets/create', payload);
    //getting the new updated list of tickets for the user:
    const { data } = await axios.get(`http://localhost:3396/api/tenantTickets/fetch/${this.props.userData.id}`);
    this.props.setTicketsData(data);
    //return back to list of entries view:
    this.props.setTicketEditState('preview');
  }

  render() {
    return (
      <div>
        <br/><br/>
        TICKET INFORMATION <br/><br/>
        <input type='text' name='category' placeholder='category'></input>
        <br/><br/>
        <input type='text' name='apt_num' placeholder='Apt. Num'></input>
        <br/><br/>
        <input type='text' name='subject' placeholder='Subject'></input>
        <br/><br/>
        <input type='text' name='description' placeholder='Please describe the issue...'></input>
        <br/><br/>
        <input type='text' name='photo_url' placeholder='If you have a photo, provide url here'></input>
        <br/><br/>
        <button onClick={this.submitNewTicket.bind(this)}>SUBMIT</button> 
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData:state.userData,
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

export default (connect(mapStateToProps, matchDispatchToProps)(TicketEntryForm));