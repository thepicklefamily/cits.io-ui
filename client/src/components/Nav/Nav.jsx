import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import Logout from '../Auth/Logout.jsx';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  // use conditionals to render different navs
  // change chat to instead push the name of the users property that they belong to
  render() {
    return (
      <div>
        HELLO FROM NAV<br/>
        <button onClick={() => this.props.history.push('/')}>Go to Home</button>
        { this.props.userData ? <Logout/> : <div><button onClick={() => this.props.history.push('/login')}>Go to Login</button><button onClick={() => this.props.history.push('/signup')}>Go to Signup</button></div> }
        <button onClick={() => this.props.history.push('/chat')}>Go to Chat</button>  
        <button onClick={() => this.props.history.push('/phonebook')}>Go to Phonebook</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);