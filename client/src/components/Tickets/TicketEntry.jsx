import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setCurrentTicketEntry } from '../../actions/setCurrentTicketEntry';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import axios from 'axios';
import swal from 'sweetalert2';

class TicketEntry extends Component {
  constructor(props) {
    super(props);
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
  }

  onDetailsHandler() {
    this.props.setCurrentTicketEntry(this.props.data);
    this.props.setTicketEditState('details');
  }

  deleteModalHandler() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.onDeleteHandler();
        swal(
          'Deleted!',
          'This ticket has been deleted.',
          'success'
        )
      }
    })
  }

  async onDeleteHandler() {
    //delete:
    await axios.delete(`http://localhost:3396/api/userTickets/delete/${this.props.data.id}`, this.config);
    //get and set the new updated list of tickets for the property for the property manager:
    const { data } = await axios.get(`http://localhost:3396/api/propTickets/fetch/${this.props.data.propertyid}`, this.config);
    this.props.setTicketsData(data);
    //return back to list of entries view:
    this.props.setTicketEditState('list');
  }

  render() {
    return (
      <div>
        Ticket Entry: <br/>
        subject: {`${this.props.data.subject}`}
        category: {`${this.props.data.category}`}
        apt_num: {this.props.data.apt_num} <br/>
        description: {this.props.data.description} <br/>
        status: {this.props.data.status} <br/>
        {<button onClick={this.onDetailsHandler.bind(this)}>DETAILS</button>}
        {localStorage.getItem('type') === '1' ? 
          <button onClick={this.deleteModalHandler.bind(this)}>DELETE</button> 
          : 
          null
        }
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ticketsData: state.ticketsData,
    ticketEditState: state.ticketEditState,
    currentTicketEntry: state.currentTicketEntry
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentTicketEntry: setCurrentTicketEntry,
    setTicketsData: setTicketsData,
    setTicketEditState: setTicketEditState
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(TicketEntry);
