import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setUserData } from '../../actions/setUserData';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  onSubmitHandler() {
    this.props.setUserData(null);
  }

  render() {
    return (
      <div>
        <button onClick={this.onSubmitHandler.bind(this)}>Logout</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setUserData:setUserData
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Logout));