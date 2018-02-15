import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Login from '../Auth/Login.jsx';
import Core from '../Core/Core.jsx';
import Nav from '../Nav/Nav.jsx';
import { Route, Switch } from 'react-router-dom';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';

import './Mein.css';

class Mein extends Component {
  constructor(props) {
    super(props);
  }
  // componentdidmount and update fetch properties by userid

  componentWillMount() {
    this.props.setPhonebookEditState(false);
  }

  render() {
    console.log(process.env.NODE_ENV)
    return (
      <div>
        <div className="banner">
          {/* <img src="/assets/images/banner.jpg" alt=""/> */}
          <div className="banner-content">
            {
              !localStorage.getItem('token') ?
              <div>
                <h2>CITS</h2>
                <h4>Renting Made Easy</h4>
                <button className="signup">Sign Up!</button>
              </div>
              :
              <div>
                <h2>Welcome,</h2>
                <h4>{localStorage.getItem('full_name')}</h4>
              </div>
            }

          </div>
        </div>

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