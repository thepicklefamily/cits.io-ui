import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import { setChatNotificationSocket } from '../../actions/setChatNotificationSocket';
import { setNotificationProperties } from '../../actions/setNotificationProperties';
import mainLogo from '../../../public/assets/icons/cits-logo.png';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';

import './Nav2.css';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userProps: []
    };

    this.config = {
      headers: {
        authorization: ''
      }
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.propDropdownHandler = this.propDropdownHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  async componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.SOCKET_URL = (process.env.NODE_ENV === 'production') ? process.env.SOCKET_SERVER_AWS_HOST : process.env.SOCKET_SERVER_LOCAL_HOST;

    // get all user properties
    try {
      if (localStorage.getItem('id')) {
        const userProps = await axios.get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);
  
        await this.setState({
          userProps: userProps.data
        });
      }
    } catch (err) {
      //
    }

    try {
      await this.setPropertyList();

      //initiate socket connection for notifications and add to state:
      const socket = io(`${this.SOCKET_URL}/chat-notifications`);
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

      this.props.chatNotificationSocket.on('notifications.whileonline', ({ userId, propId }) => {
        console.log('notifications.whileonline data = ', userId, propId);
        //if the notification is for a msg not from this user, on this users prop list, and not on the notification props list yet
        //then add it to the notification props list and re-render notifications.
        if (userId !== +localStorage.getItem('id') && this.props.notificationProperties.indexOf(+propId) === -1 && this.props.propertyData) {
          for (let i = 0; i < this.props.propertyData.length; i++) {
            if (+propId === this.props.propertyData[i].id) {
              this.props.setNotificationProperties(this.props.notificationProperties.concat(+propId));
              this.renderNotifications();
            }
          }
        }
      });
    } catch (err) {
      //
    }
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

    document.getElementById('notification').play();
  }

  //get and set user's properties list onto state
  async setPropertyList() {
    try {
      this.config.headers.authorization = localStorage.getItem('token');
      const { data } = await axios.get(`${this.REST_URL}/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);
      //sometimes get an error object (that's not a catch err) re token instead of actual property list array - eg if not logged in
      Array.isArray(data) ? this.props.setPropertyData(data) : null;
    } catch (err) {
      //
    }
  }

  sendInfoForInitialNotifications() {
    if (this.props.propertyData) {
      this.props.chatNotificationSocket.emit('notifications.ready', {
        userId: localStorage.getItem('id'),
        propsArray: this.props.propertyData.map(prop => prop.id)
      });
    }
  }

  handleMouseOver(e) {
    let changeImg = document.querySelectorAll(`#${e.target.id} img`)[0];
    changeImg.src = `assets/icons/${e.target.id}-icon-sm-green.png`;
  }

  handleMouseOut(e) {
    let changeImg = document.querySelectorAll(`#${e.target.id} img`)[0];
    changeImg.src = `assets/icons/${e.target.id}-icon-sm-gray.png`;
  }

  propDropdownHandler(id) {
    localStorage.setItem('propertyId', id);
    location.reload();
  }

  logoutHandler() {
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
  }

  render() {
    return (
      <div className="header">
        {localStorage.getItem('token') ?
          // LOGGED IN
          <div className="container">
            <div className="row">
              <div 
                onClick={() => this.props.history.push('/')}
                className="navLeft col-lg-4 col-md-4 col-sm-12 col-xs-12"
              >
                <img src='assets/icons/cits-logo.png' id='propSelectButton' onClick={() => console.log('o hai, I am propSelectButton')} />
              </div>
              <div className="navRight col-lg-8 col-md-8 col-sm-12 col-xs-12">
                <div className="navi">
                  <div
                    // onMouseOver={this.handleMouseOver}
                    // onMouseLeave={this.handleMouseOut}
                    className="test dropdown"
                    id="account"
                  >
                    <img src='assets/icons/account-icon-sm-green.png' id="account" />
                    &nbsp;&#x25BE;
                    <div className="dropdown-content">
                      <p onClick={() => {this.props.history.push('/profile')}}>
                        My Account
                      </p>

                      <p onClick={this.logoutHandler}>
                        Log Out
                      </p>
                    </div>
                  </div>
                  
                  <div
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseOut}
                    onClick={() => this.props.history.push('/chat')}
                    className="test"
                    id="chat"
                  >
                    <img id="chat" src='assets/icons/chat-icon-sm-gray.png' />
                  </div>

                  <div
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseOut}
                    onClick={() => this.props.history.push('/articles')}
                    className="test"
                    id="articles"
                  >
                    <img id="articles" src="assets/icons/articles-icon-sm-gray.png" />
                  </div>

                  <div
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseOut}
                    onClick={() => this.props.history.push('/tickets')}
                    className="test"
                    id="tickets"
                  >
                    <img id="tickets" src='assets/icons/tickets-icon-sm-gray.png' />
                  </div>

                  <div
                    onMouseOver={this.handleMouseOver}
                    onMouseLeave={this.handleMouseOut}
                    onClick={() => this.props.history.push('/phonebook')}
                    className="test"
                    id="phonebook"
                  >
                    <img id="phonebook" src='assets/icons/phonebook-icon-sm-gray.png' />
                  </div>

                  <div
                    className="test dropdown"
                    id="castlePNG"
                  >
                    <img src='assets/icons/castle-icon-sm-green.png' id="castlePNG" />
                    &nbsp;&#x25BE;
                    <div className="dropdown-content">
                      {
                        !this.state.userProps.length ? null :
                        this.state.userProps.map(prop => 
                          <p 
                            onClick={() => this.propDropdownHandler(prop.id)}
                            key={prop.id}
                          >
                            {prop.name}
                          </p>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          // LOGGED OUT
          <div className="container">
            <div className="row">
              <div className="navLeft col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <img src='assets/icons/cits-logo.png' id="propSelectButton" onClick={() => this.props.history.push('/')} />
              </div>

              <div className="navRight col-lg-8 col-md-8 col-sm-12 col-xs-12">
                <div className="navi">
                  <button className="test" className="logged-out-btn" onClick={() => this.props.history.push('/login')}>Log In</button>
                  <button className="test" className="logged-out-btn" onClick={() => this.props.history.push('/signup')}>Sign Up</button>
                </div>
              </div>



              <div 
                className="navRight col-lg-8 col-md-8 col-sm-12 col-xs-12"
                onClick={() => this.props.history.push('/login')}
              >
              </div>
            </div>
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