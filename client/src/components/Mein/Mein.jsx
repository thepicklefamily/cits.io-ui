import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Login from '../Auth/Login.jsx';
import Core from '../Core/Core.jsx';
import Nav from '../Nav/Nav.jsx';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

class Mein extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <br/><br/>
        BANNER GOES HERE
        <br/><br/>
        <Switch>
          <Route path='/newworld' component={Nav}/>
          <Route path='/' component={Core}/>
        </Switch>
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

export default (connect(mapStateToProps, matchDispatchToProps)(Mein));