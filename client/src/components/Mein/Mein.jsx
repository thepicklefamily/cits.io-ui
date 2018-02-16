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
                <button 
                  className="signup"
                  onClick={() => {this.props.history.push('/signup')}}
                >
                  Sign Up Now!
                </button>
              </div>
              :
              <div>
                <h2>Welcome,</h2>
                <h4>{localStorage.getItem('full_name')}</h4>
              </div>
            }
          </div>
        </div>
        <div className="container">
          {
            !localStorage.getItem('token') ? null :
            <div className="row">
              <div 
                className="col-lg-4 col-md-4 col-sm-12 col-xs-12 sec"
                onClick={() => this.props.history.push('/chat')}
              >
                <div>
                  <img src="assets/images/chat-icon-lg.png" alt="chat-icon"/><br/><br/>
                  <h5>CHAT</h5>
                </div>
              </div>

              <div 
                className="col-lg-4 col-md-4 col-sm-12 col-xs-12 sec"
                onClick={() => this.props.history.push('/tickets')}
              >
                <div>
                  <img src="assets/images/tickets-icon-lg.png" alt="tickets-icon"/><br/><br/>
                  {
                    localStorage.getItem('type') === '0' ?
                    <h5>SUBMIT A TICKET</h5>
                    :
                    <h5>SUBMITTED TICKETS</h5>
                  }
                </div>
              </div>

              <div 
                className="col-lg-4 col-md-4 col-sm-12 col-xs-12 sec"
                onClick={() => this.props.history.push('/phonebook')}
              >
                <div>
                  <img src="assets/images/phonebook-icon-lg.png" alt="phonebook-icon"/><br/><br/>
                  <h5>MAINTENANCE DIRECTORY</h5>
                </div>
              </div>
            </div>
          }
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