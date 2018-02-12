import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import { setChatNotificationSocket } from '../../actions/setChatNotificationSocket';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }



  async componentWillMount () {

    this.setPropertyList();

    //initiate socket connection for notifications and add to state
    const socket = io('http://localhost:4155/chat-notifications');
    await this.props.setChatNotificationSocket(socket);

    this.props.chatNotificationSocket.on('connect', (data) => {
      console.log('connected to chat-notifications socket');
      //send user id so socket server can look up initial notifications to give

      /*ADD HERE: SEND PROP IDS FROM STATE TOO - THIS WAY ONLY LOOKING UP USER'S CURRENT PROPS - eg if they deleted props, those entries would still be in mongodb
      but dont want notifications for those, so instead send an array telling server all possible props to care about and look up */
      this.props.chatNotificationSocket.emit('notifications.ready', { userId: localStorage.getItem('id') } );
    });
    this.props.chatNotificationSocket.on('initial.notifications', (data) => {
      console.log('initial.notifications data = ', data);
      //should get an array of prop ids for which to render notifications
      //here would want to update state where you would also have logic to appropriately render the initial notifications in nav bar
    });
    this.props.chatNotificationSocket.on('notifications.whileonline', (data) => {
      console.log('notifications.whileonline data = ', data);
      //should get a propId, one at a time, when any messages are sent.
      //would want to see if that propId exists on this user (prolly on state)
        //if so, appropriately render the notification in nav bar
    });


    //getting userId ahead of time because speed is extremely important here.
    const userId = localStorage.getItem('id');
    //sending last times user was in any property chat rooms when user leaves site
    window.onbeforeunload = function () {
      if (window.location.href === "http://localhost:3000/chat") {
        const payload = {
          userId,
          //may send null for propIDTimeStampTuples if nothing there. cant afford speed loss of managing if null here - will manage that on server
          //also, the new entry made and sent here won't ever be saved, but that's fine, don't need it to be.
          times: `${localStorage.getItem('propIDTimeStampTuples')}|${localStorage.getItem('propertyId')},${Date.now()}`,
        };
        socket.emit('send.lastonline', payload);
      } else {
        const payload = {
          userId,
          times: localStorage.getItem('propIDTimeStampTuples'),
        };
        socket.emit('send.lastonline', payload);
      }
    };
    localStorage.removeItem('propIDTimeStampTuples'); //not too important, but if time, why not. also clearing this item on logout
  }

  //not using in window.onbeforeunload (or anywhere) anymore because it's too slow
  sendPropIDTimeStampTuples() {
    let prevLocalStorage = localStorage.getItem('propIDTimeStampTuples');
    prevLocalStorage ? 
      `${prevLocalStorage}|${localStorage.getItem('propertyId')},${Date.now()}`
      :
      `${localStorage.getItem('propertyId')},${Date.now()}`;
  }

  //get and set user's properties list onto state
  async setPropertyList() {
    this.config.headers.authorization = localStorage.getItem('token');
    const { data } = await axios.get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);
    this.props.setPropertyData(data);
  }

  // use conditionals to render different navs
  // change chat to instead push the name of the users property that they belong to

  render() {
    return (
      <div className="header">
        { localStorage.getItem('token') ? 
          // LOGGED IN
          <div>
            <button onClick={() => this.props.history.push('/')}>Go to Home</button>
            <button onClick={() => this.props.history.push('/profile')}>Go to Profile</button>
            <button onClick={() => this.props.history.push('/phonebook')}>Go to Phonebook</button>
            <button onClick={() => this.props.history.push('/chat')}>Go to Chat</button>
            <button onClick={() => this.props.history.push('/tickets')}>Go to Tickets</button>
            <button onClick={() => this.props.history.push('/articles')}>Go to Articles</button>
            <button onClick={() => {(
              this.props.setPropertyData(null),
              this.props.setCurrentProperty(null),
              localStorage.removeItem('token'),
              localStorage.removeItem('propertyId'),
              localStorage.removeItem('id'),
              localStorage.removeItem('type'),
              localStorage.removeItem('username'),
              localStorage.removeItem('email'),
              localStorage.removeItem('full_name'),
              localStorage.removeItem('phonenumber'),
              localStorage.removeItem('propIDTimeStampTuples'),
              this.props.history.push('/')
            )}}>LOGOUT</button>
          </div> 
          : 
          // LOGGED OUT
          <div>
            <button onClick={() => this.props.history.push('/')}>Go to Home</button>
            <button onClick={() => this.props.history.push('/login')}>Go to Login</button>
            <button onClick={() => this.props.history.push('/signup')}>Go to Signup</button>
          </div>
        }  
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    propertyData: state.propertyData,
    chatNotificationSocket: state.chatNotificationSocket
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPropertyData,
    setCurrentProperty,
    setChatNotificationSocket
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);