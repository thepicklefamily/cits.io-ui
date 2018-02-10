import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Login from '../Auth/Login.jsx';
import Core from '../Core/Core.jsx';
import Nav from '../Nav/Nav.jsx';
import { Route, Switch } from 'react-router-dom';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';

class Mein extends Component {
  constructor(props) {
    super(props);
  }
  // componentdidmount and update fetch properties by userid

  componentWillMount() {
    this.props.setPhonebookEditState(false);
  }

  render() {
    return (
      <div>
        <h3>BANNER GOES HERE</h3>
        {localStorage.getItem('token') ? 
          <div>Status: Logged In</div> 
          : 
          <div>Status: Logged Out</div>
        }
        <Switch>
          <Route path='/' component={Core}/> {/* THIS IS WHERE THE HEADLINES/PRODUCT INFO GOES */}
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
    setPhonebookEditState:setPhonebookEditState
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Mein);