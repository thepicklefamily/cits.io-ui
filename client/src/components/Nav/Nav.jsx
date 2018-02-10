import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import io from 'socket.io-client/dist/socket.io.js';

class Nav extends Component {
  constructor(props) {
    super(props);
  }


  componentWillMount () {
    
    var socket = io('http://localhost:4155/chat-notifications');

    socket.on('connect', (data) => {
      console.log('connected to chat-notifications socket');
      //send user id so socket server can look up initial notifications to give
      socket.emit('notifications.ready', { userId: localStorage.getItem('id') } );
    });
    socket.on('initial.notifications', (data) => {
      console.log('initial.notifications data = ', data);
      //should get an array of prop ids for which to render notifications
      //here would want to update state where you would also have logic to appropriately render the initial notifications in nav bar
    });
    socket.on('notifications.whileonline', (data) => {
      console.log('notifications.whileonline data = ', data);
      //should get a propId, one at a time, when any messages are sent.
      //would want to see if that propId exists on this user (prolly on state)
        //if so, appropriately render the notification in nav bar
    });

  }

  sendLastTimeInChat () {
    //send the last times in each chat room for each prop to socket server to update mongodb.

    //last online times should be in state. may even just use that instead of payload.
    //what if they x out from chat itself though. both chat and nav bar components open. which component would unmount first?
    //chat has to update state before this can send proper info.

    socket.emit('lastOnlineTimes', payload);
  }

  componentWillUnmount () {
    //if still logged in, send the lastonline times from state
    //otherwise, will have already sent it when logged out (below in logout button)
    localStorage.getItem('token') ? this.sendLastTimeInChat() : null;
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
              this.sendLastTimeInChat.bind(this),
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
    //
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPropertyData: setPropertyData,
    setCurrentProperty: setCurrentProperty
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);