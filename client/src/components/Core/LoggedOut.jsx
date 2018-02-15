import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import './Core.css';

class LoggedOut extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        LOGGED OUT
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

export default connect(mapStateToProps, matchDispatchToProps)(LoggedOut);