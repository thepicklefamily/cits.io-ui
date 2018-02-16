import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import './Core.css';

class LoggedOut extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 welcome">
          <h5>WELCOME TO CASTLE IN THE SKY</h5><br/>
          <p className="container">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 secondary-banner">
          <div className="secondary-banner-content">
            #1 TRUSTED
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 easy">
          <h4>EASY TO USE</h4>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 feature">
              <img src="assets/images/find.png" alt="find"/>
              <div className="feature-title">
                FIND
              </div>
              <div className="feature-content">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
              </div>
            </div>
            
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 feature">
              <img src="assets/images/join.png" alt="join"/>
              <div className="feature-title">
                JOIN
              </div>
              <div className="feature-content">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 feature">
              <img src="assets/images/manage.png" alt="manage"/>
              <div className="feature-title">
                MANAGE
              </div>
              <div className="feature-content">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 third-banner">
          <div className="third-banner-content">
            Join Us Today!
            <div>
              <button 
                className="signup"
                onClick={() => {this.props.goToPage('/signup')}}
              >
                SIGN UP NOW
              </button>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(LoggedOut);