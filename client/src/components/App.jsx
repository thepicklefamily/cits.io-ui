import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Signup from './Auth/Signup.jsx';
import Mein from './Mein/Mein.jsx';
import Login from './Auth/Login.jsx';
import Core from './Core/Core.jsx';
import Nav from './Nav/Nav.jsx';
import Footer from './Footer/Footer.jsx';
import Phonebook from './Phonebook/Phonebook.jsx';
import Profile from './Profile/Profile.jsx';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from '../store.js';
// import { withRouter } from 'react-router';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <div>
            <h4>*----- NAV TOP -----*</h4>
            <Switch>
              <Route path='/' component={Nav}/>
            </Switch>
            <h4>*----- NAV BOTTOM -----*</h4>
            <br/>
            <h4>*----- MAIN TOP -----*</h4>
            <Switch> 
              <Route path='/profile' component={Profile}/>
              <Route path='/phonebook' component={Phonebook}/>
              <Route path='/signup' component={Signup}/>
              <Route path='/login' component={Login}/>
              <Route path='/' component={Mein}/>
            </Switch>
            <h4>*----- MAIN BOTTOM -----*</h4>
            <br/>
            <h4>*----- FOOTER TOP -----*</h4>
            <Footer/>
            <h4>*----- FOOTER BOTTOM -----*</h4>
          </div>
        </BrowserRouter>
      </Provider>
    )
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

export default connect(mapStateToProps, matchDispatchToProps)(App);