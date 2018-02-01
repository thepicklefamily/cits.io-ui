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
            <h5>NAV TOP</h5>
            <Switch>
              <Route path='/' component={Nav}/>
            </Switch>
            <h5>NAV BOTTOM</h5>
            <br/><br/>
            <h5>MAIN TOP</h5>
            <Switch> 
              <Route path='/login' component={Login}/>
              <Route path='/' component={Mein}/>
            </Switch>
            <h5>MAIN BOTTOM</h5>
            <br/><br/>
            <h5>FOOTER TOP</h5>
            <Footer/>
            <h5>FOOTER BOTTOM</h5>
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