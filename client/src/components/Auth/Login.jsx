require('babel-polyfill');
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setUserData } from '../../actions/setUserData';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import axios from 'axios';
// import { withRouter } from 'react-router';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
      await axios.post('http://localhost:3396/api/auth/login', payload) 
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
      (this.props.setUserData(d.data), this.props.history.push('/')) 
      : 
      console.log('bad username and/or bad password'); // HANDLE ERROR HERE
    let config = {
      headers: {
        authorization: localStorage.getItem('token')
      }
    };
    const propertyData = await axios
      .get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${d.data.id}`, config)
    this.props.setPropertyData(propertyData.data);
    localStorage.setItem('propertyId', JSON.stringify(propertyData.data[0].id));
    await this.props.setCurrentProperty(propertyData.data[0]);
  }

  render() {
    return (
      <div>
        Login Page Says Hello!
        <div>
          Username:<br/>
          <input type='text' name='username'/><br/>
          Password:<br/>
          <input onKeyUp={this.handleKeyPress} type='password' name='password'/><br/>
          <button onClick={this.onSubmitHandler.bind(this)}>Submit</button>
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
    userData: state.userData,
    currentProperty: state.currentProperty
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setUserData: setUserData,
    setPropertyData: setPropertyData,
    setCurrentProperty: setCurrentProperty
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Login));