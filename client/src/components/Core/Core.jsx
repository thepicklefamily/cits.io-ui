import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Login from '../Auth/Login.jsx';
import { Route, Switch } from 'react-router-dom';

class Core extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>PRODUCT INFORMATION</h3>
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

export default connect(mapStateToProps, matchDispatchToProps)(Core);