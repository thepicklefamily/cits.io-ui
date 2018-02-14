import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import { setChatNotificationSocket } from '../../actions/setChatNotificationSocket';
import { setNotificationProperties } from '../../actions/setNotificationProperties';
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

    await this.setPropertyList();

    //initiate socket connection for notifications and add to state:
    const socket = io('http://localhost:4155/chat-notifications');
    await this.props.setChatNotificationSocket(socket);
    await this.props.chatNotificationSocket.on('connect', (data) => {
      console.log('connected to chat-notifications socket');
      //send userid and array of user's props so server can tell client which props to give this user notifications for:
      this.sendInfoForInitialNotifications();
    });
    this.props.chatNotificationSocket.on('initial.notifications', (notifPropsArray) => {
      //should get an array of prop ids for which to render notifications.
      console.log('init.notifpropsarray', notifPropsArray);
      if (notifPropsArray.length) {
        this.props.setNotificationProperties(notifPropsArray);
        this.renderNotifications();
      }
    });
    this.props.chatNotificationSocket.on('notifications.whileonline', ({userId, propId}) => {
      console.log('notifications.whileonline data = ', userId, propId);
      //if the notification is for a msg not from this user, on this users prop list, and not on the notification props list yet
      //then add it to the notification props list and re-render notifications.
      if (userId !== +localStorage.getItem('id') && this.props.notificationProperties.indexOf(+propId) === -1) {
        for (let i = 0; i < this.props.propertyData.length; i++) {
          if (+propId === this.props.propertyData[i].id) {
            this.props.setNotificationProperties(this.props.notificationProperties.concat(+propId));
            this.renderNotifications();
          }
        }
      }
    });
  }

  //anytime get or do something notifications worthy / change the state of the notificationProperties, then run this func to render them all properly:
  renderNotifications() {
            //if a property on the notifications list array is the current property, render the notification on the chat button, unless the user is looking at the chat page:
    if (this.props.notificationProperties.includes(+localStorage.getItem('propertyId')) && window.location.href !== "http://localhost:3000/chat" || 
      this.props.notificationProperties.includes(+localStorage.getItem('propertyId')) && !document.hasFocus()) {
      document.getElementById('chatButton').innerHTML = 'Go to Chat *MSG*';
      document.title = '● CITS';
    }
    //if there is a property on the notifications list array that isn't the current property, render the notification on the property select button:
    let notifsDisplay = '';
    for (let i = 0; i < this.props.notificationProperties.length; i++) {
      if (this.props.notificationProperties[i] !== +localStorage.getItem('propertyId')) {
        notifsDisplay += ` ${this.props.notificationProperties[i]}`;
      }
    }
    notifsDisplay !== '' ? 
      (document.getElementById('propSelectButton').innerHTML = `CastleLogo *MSG* for props${notifsDisplay}`,
      document.title = '● CITS')
      :
      null;
  }

  //get and set user's properties list onto state
  async setPropertyList() {
    this.config.headers.authorization = localStorage.getItem('token');
    const { data } = await axios.get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);
    //sometimes get an error object re token instead of actual property list array - eg if not logged in
    Array.isArray(data) ? this.props.setPropertyData(data) : null;
  }

  sendInfoForInitialNotifications () {
    if (this.props.propertyData) {
      this.props.chatNotificationSocket.emit('notifications.ready', { 
        userId: localStorage.getItem('id'),
        propsArray: this.props.propertyData.map(prop => prop.id)
      });
    }
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
            <button id='chatButton' onClick={() => this.props.history.push('/chat')}>Go to Chat</button>
            <button onClick={() => this.props.history.push('/tickets')}>Go to Tickets</button>
            <button onClick={() => this.props.history.push('/articles')}>Go to Articles</button>
            <button id='propSelectButton' onClick={() => console.log('o hai, I am propSelectButton')}>CastleLogo</button>
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
              document.title = 'CITS',
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
    chatNotificationSocket: state.chatNotificationSocket,
    notificationProperties: state.notificationProperties
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPropertyData,
    setCurrentProperty,
    setChatNotificationSocket,
    setNotificationProperties
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);