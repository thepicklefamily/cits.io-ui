import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputError: false
    }
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  handleKeyPress(e) {
    (e.keyCode === 13) ? this.onSubmitHandler() : null;
  }

  async onSubmitHandler() {
    const payload = {
      username: document.getElementsByName('username')[0].value,
      password: document.getElementsByName('password')[0].value
    }
    try {
      const d = await axios.post('http://localhost:3396/api/auth/login', payload) 
      this.setState({ inputError: false });
      await localStorage.removeItem('randid');
      await localStorage.setItem('token', JSON.parse(d.headers.authorization).accessToken);
      await localStorage.setItem('id', d.data.id);
      await localStorage.setItem('username', d.data.username);
      await localStorage.setItem('type', d.data.type);
      await localStorage.setItem('full_name', d.data.full_name);
      await localStorage.setItem('email', d.data.email);
      await localStorage.setItem('phonenumber', d.data.phonenumber);
      this.props.history.push('/');
    }
    catch (err) {
      document.getElementsByName('password').forEach( field => field.value = '' );
      this.setState({ inputError: true });
    }

    // const d = payload.username.length && payload.password.length ? 
    //   await axios.post('http://localhost:3396/api/auth/login', payload)
    //     try {}
    //   : 
    //   {};

    // d.data ? 
    //   this.props.history.push('/') 
    //   : 
    //   console.log('bad username and/or bad password'); // HANDLE ERROR HERE
    this.config.headers.authorization = await localStorage.getItem('token')
    const propertyData = await axios.get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config)
    this.props.setPropertyData(propertyData.data);
    localStorage.setItem('propertyId', propertyData.data[0].id.toString());
    await this.props.setCurrentProperty(propertyData.data[0]);
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
          { this.state.inputError ? <div className="loginError">Invalid Username/Password. Please try again.</div> : null }
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
    currentProperty: state.currentProperty
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPropertyData: setPropertyData,
    setCurrentProperty: setCurrentProperty
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Login);