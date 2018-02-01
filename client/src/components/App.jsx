import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Mein from './Mein/Mein.jsx';
import Login from './Auth/Login.jsx';
import Core from './Core/Core.jsx';
import Nav from './Nav/Nav.jsx';
import Footer from './Footer/Footer.jsx';
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
          <Switch>
            <Route path='/' component={Nav}/>
          </Switch>
          <Switch> 
            <Route path='/login' component={Login}/>
            <Route path='/' component={Mein}/>
          </Switch>
          <Footer/>
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