require('babel-polyfill');
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { setUserData } from '../../actions/setUserData';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  async onSubmitHandler() {
    await this.props.setUserData('helloworld')
    const payload = {
      username: document.getElementsByName('username')[0].value,
      password: document.getElementsByName('password')[0].value
    }
    const d = payload.username.length && payload.password.length ? await axios.post('http://localhost:3396/api/auth/login', payload) : {};
    d.data ? (this.props.setUserData(d.data), this.props.history.push('/')) : console.log('bad username and/or bad password');
  }

  render() {
    return (
      <div>
        Login Page Says Hello!
        <div>
          Username:<br/>
          <input type='text' name='username'/><br/>
          Password:<br/>
          <input type='text' name='password'/><br/>
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
    userData: state.userData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setUserData:setUserData
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Login));