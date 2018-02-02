import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropertySearch from './PropertySearch';

class Signup extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userType: '',
      full_name: '',
      email: '',
      username: '',
      phone: 0,
      password: '',
      propertyID: null,
      propName: '',
      propAddress: '',
      propSecret: ''
    }

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  submitHandler() {
    console.log(this.state);
  }

  render() {
    return (
      <div>
        Hello from signup!
        {/* Standard form displayed on page load */}
        <form action="/api/auth/signup" method="post">
          <div>
            Select User Type:
            <select 
              name="userType"
              defaultValue="select"
              onChange={this.inputChangeHandler}
            >
              <option name="select" value="">Select User Type</option>
              <option name="tenant" value="tenant">Tenant</option>
              <option name="manager" value="manager">Manager</option>
            </select>
          </div>
          
          <div>
            Full Name:
            <input 
              name="full_name" 
              placeholder="Enter Full Name"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Email:
            <input 
              name="email" 
              placeholder="Enter Email"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Username:
            <input 
              name="username" 
              placeholder="Enter Username"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Phone:
            <input 
              name="phone" 
              placeholder="Phone Number"
              onChange={this.inputChangeHandler}
            />
          </div>

          <div>
            Password:
            <input 
              name="password" 
              placeholder="Enter Password"
              onChange={this.inputChangeHandler}
            />
          </div>
        </form>

        {/* Conditional properties form based on selected user type */}
        {
          !this.state.userType ? null :
          this.state.userType === 'tenant' ? 
            <div>
              Property (Tenant):
              <PropertySearch 
                inputChangeHandler={this.inputChangeHandler}
                userType={this.state.userType} 
              />
              needs:
              - selected property OR
              - new property fields
            </div>
          :
          this.state.userType === 'manager' ? 
            <div>
              Property (Manager):
              <PropertySearch 
                inputChangeHandler={this.inputChangeHandler}
                userType={this.state.userType}
              />
            </div>
          : null
        } 
        {
          !this.state.userType ? null :
          <div>
            <button
              onClick={this.submitHandler}
            >
              Sign Up
            </button>
          </div>
        }
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
    //
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));