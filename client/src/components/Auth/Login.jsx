import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
  }

  handleKeyPress(e) {
    (e.keyCode === 13) ? this.onSubmitHandler() : null;
  }

  async onSubmitHandler() {
    const payload = {
      username: document.getElementsByName('username')[0].value,
      password: document.getElementsByName('password')[0].value
    }

    const d = payload.username.length && payload.password.length ? 
      await axios.post(`${this.REST_URL}/api/auth/login`, payload) 
      : 
      {};
    localStorage.removeItem('randid');
    localStorage.setItem('token', JSON.parse(d.headers.authorization).accessToken);
    localStorage.setItem('id', d.data.id);
    localStorage.setItem('username', d.data.username);
    localStorage.setItem('type', d.data.type);
    localStorage.setItem('full_name', d.data.full_name);
    localStorage.setItem('email', d.data.email);
    localStorage.setItem('phonenumber', d.data.phonenumber);

    d.data ? 
      this.props.history.push('/')
      : 
      console.log('bad username and/or bad password'); // HANDLE ERROR HERE
    this.config.headers.authorization = await localStorage.getItem('token')
    const { data } = await axios.get(`${this.REST_URL}/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config)
    this.props.setPropertyData(data);
    localStorage.setItem('propertyId', data[0].id.toString());
    this.props.setCurrentProperty(data[0]);
    data ? 
      this.sendInfoForInitialNotifications(data)
      :
      null;
  }

  sendInfoForInitialNotifications (data) {
    this.props.chatNotificationSocket.emit('notifications.ready', { 
      userId: localStorage.getItem('id'),
      propsArray: data.map(prop => prop.id)
    });
  }

  render() {
    return (
      <div className="loginMain">
        <h2 id="loginWord">LOGIN</h2>
        <div className="loginInner">
          <br/>
          <input placeholder="Username" type='text' name='username'/><br/>
          <br/>
          <input placeholder="Password" onKeyUp={this.handleKeyPress.bind(this)} type='password' name='password'/><br/>
          <button id="loginButton" onClick={this.onSubmitHandler.bind(this)}>Log In</button>
          <a onClick={() => {this.props.history.push('/signUp')}} id="orSignUp">or sign up</a>
        </div>
      </div>
    );
  }

  /* --- Below is a working implementation of firing a post form action to the appropriate server route --- */
  // render() {
  //   return (
  //     <div>
  //       Login Page Says Hello!
  //       <form action='http://localhost:3396/api/auth/login' method="post">
  //         Username:<br/>
  //         <input type='text' name='username'/><br/>
  //         Password:<br/>
  //         <input type='text' name='password'/><br/>
  //         <input type='submit' value='Submit'/>
  //       </form>
  //     </div>
  //   );
  // }
  
}

const mapStateToProps = state => {
  return {
    currentProperty: state.currentProperty,
    propertyData: state.propertyData,
    chatNotificationSocket: state.chatNotificationSocket
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPropertyData,
    setCurrentProperty
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Login);