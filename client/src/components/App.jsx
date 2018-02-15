import 'babel-polyfill';
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
import Chat from './Chat/Chat.jsx';
import Articles from './Articles/Articles.jsx';
import Tickets from './Tickets/Tickets.jsx';
import UserProfile from './Profile/UserProfile';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store.js';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <div className="davidContainer">
            <Switch>
              <Route path='/' component={Nav} />
            </Switch>
            <div className="main">
              <Switch>
                <Route path='/profile' component={Profile} />
                <Route path='/phonebook' component={Phonebook} />
                <Route path='/signup' component={Signup} />
                <Route path='/login' component={Login} />
                <Route path='/chat' component={Chat} />
                <Route path='/userProfile' component={UserProfile} />
                <Route path='/tickets' component={Tickets} />
                <Route path='/articles' component={Articles} />
                <Route path='/' component={Mein} />
              </Switch>
            </div>
            <Footer />
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