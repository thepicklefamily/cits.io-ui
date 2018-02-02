import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Hello from signup!
        <form action="/api/auth/signup" method="post">
          <input/>
          <input/>
          <input/>
          <input/>
          <input/>
        </form>
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

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));