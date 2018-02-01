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
  // componentdidmount and update fetch properties by userid

  render() {
    return (
      <div>
        *----THIS IS THE TOP OF MEIN----*
        <br/><br/>
        BANNER GOES HERE
        <br/><br/>
        {this.props.userData ? <div>{JSON.stringify(this.props.userData)}</div> : <div>NO USER DATA IN REDUX</div>}
        <br/>
        <Switch>
          <Route path='/newworld' component={Nav}/>
          <Route path='/' component={Core}/>
        </Switch>
        <br/>
        *----THIS IS THE BOTTOM OF MEIN----*
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

export default (connect(mapStateToProps, matchDispatchToProps)(Mein));