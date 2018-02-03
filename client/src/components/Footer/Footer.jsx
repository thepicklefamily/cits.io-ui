import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';

class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        HELLO FROM FOOTER
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    phonebookData: state.phonebookData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Footer);