import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';

class Footer extends Component {
  constructor(props) {
    super(props);
    console.log('hello world ', this.props);
  }


  render() {
    return (
      <div>
        <br/><br/>
        HELLO FROM FOOTER
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

export default connect(mapStateToProps, matchDispatchToProps)(Footer);