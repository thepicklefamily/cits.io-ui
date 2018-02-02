import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  // use conditionals to render different navs
  render() {
    return (
      <div>
        HELLO FROM NAV<br/>
        <button onClick={() => this.props.history.push('/')}>Go to Home</button>
        <button onClick={() => this.props.history.push('/login')}>Go to Login</button>
        <button onClick={() => this.props.history.push('/signup')}>Go to Signup</button>
        <button onClick={() => this.props.history.push('/newworld')}>Go to New World</button>
        <button onClick={() => this.props.history.push('/chat')}>Go to Chat</button>
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
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);