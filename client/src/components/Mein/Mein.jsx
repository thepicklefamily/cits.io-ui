import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Login from '../Auth/Login.jsx';
import Core from '../Core/Core.jsx';
import Nav from '../Nav/Nav.jsx';
import Chat from '../Chat/Chat.jsx';
import Articles from '../Articles/Articles';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
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
        {this.props.userData ? 
          <div>Status: Logged In</div> 
          : 
          <div>Status: Logged Out</div>
        }
        <Switch>
          <Route path='/chat' component={Chat}/>
          <Route path='/viewArticles' component={Articles}/>
          <Route path='/' component={Core}/> {/* THIS IS WHERE THE HEADLINES/PRODUCT INFO GOES */}
        </Switch>
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
    setPhonebookEditState:setPhonebookEditState
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Mein));