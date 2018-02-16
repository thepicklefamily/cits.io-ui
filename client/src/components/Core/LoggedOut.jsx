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
          We are the only cloud-based property management software built to not only serve your property management needs, but also build community. Every feature is custom designed specifically to provide advanced property management through the most user-friendly experience possible. With over 100 years of combined experience, our team has the proven know-how to give you the tools to succeed. Please, join us, and enjoy using our software to manage <span className='itl'>your</span> Castle In The Sky!
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
              Easily search our database of 1000s of properties across the globe to find your building. If you don't see it, just add it.
              </div>
            </div>
            
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 feature">
              <img src="assets/images/join.png" alt="join"/>
              <div className="feature-title">
                JOIN
              </div>
              <div className="feature-content">
              Once you've found your property, sign up! It takes less than a minute to set up your customized account.
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 feature">
              <img src="assets/images/manage.png" alt="manage"/>
              <div className="feature-title">
                MANAGE
              </div>
              <div className="feature-content">
              Navigate your account to share content with tenants, review and update maintenace tickets, use your handy phonebook tool, or just chat.
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