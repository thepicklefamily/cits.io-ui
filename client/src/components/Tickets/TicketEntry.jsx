import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setCurrentTicketEntry } from '../../actions/setCurrentTicketEntry';
import { setTicketEditState } from '../../actions/setTicketEditState';
import { setTicketsData } from '../../actions/setTicketsData';
import axios from 'axios';
import swal from 'sweetalert2';
import './ticketstyles.css';

class TicketEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletionError: false
    };
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
        this.onDeleteHandler().then(() => {
          if (this.state.deletionError) {
            swal('Error loading tenant details, please try again!');
          } else {
            swal(
              'Deleted!',
              'This ticket has been deleted.',
              'success'
            );
          }
        });
      }
    });
  }

  async onDeleteHandler() {
    try {
      //delete:
      this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
      console.log('rqurl', this.REST_URL);
      await axios.delete(`${this.REST_URL}/api/userTickets/delete/${this.props.data.id}`, this.config);
      this.setState({deletionError: false});
      //get and set the new updated list of tickets for the property for the property manager:
      const { data } = await axios.get(`${this.REST_URL}/api/propTickets/fetch/${this.props.data.propertyid}`, this.config);
      this.props.setTicketsData(data);
      //return back to list of entries view:
      this.props.setTicketEditState('list');
    } catch (err) {
      this.setState({deletionError: true});
    }
  }

  render() {
    return (
      <div className='entryContainer'>
        <div className='left'>
          {<div>
            <span clspanssName='subject'>{this.props.data.subject}</span>
            <span className='category'> ({this.props.data.category})</span>
            <span className='aptnum'> #{this.props.data.apt_num}</span>
            </div>}
          <div className='description'>{this.props.data.description.substring(0,50)}...</div>
          {this.props.data.status === 'Pending' ? <div className='pending'>{this.props.data.status}</div> :
            this.props.data.status === 'In-Progress' ? <div className='inprogress'>{this.props.data.status}</div> : 
            <div className='complete'>{this.props.data.status}</div>}
        </div>
        <div className='right'>
        {<div className='details'>
          <button className='detailsbtn btn btn-sm btn-light' onClick={this.onDetailsHandler.bind(this)}>
            <span>
              <img className='detailsimg' src='assets/icons/eyeball-icon-green.png'/>
            </span>
          </button>
        </div>}
        {localStorage.getItem('type') === '1' ? 
          <div className='delete'>
            <button className='deletebtn btn btn-sm btn-success' onClick={this.deleteModalHandler.bind(this)}><span><img className='deleteimg' src='assets/icons/trash-icon-white.png'/></span></button></div>
          : 
          null
        }
        </div>
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
