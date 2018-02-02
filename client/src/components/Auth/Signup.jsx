import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

class Signup extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userType: ''
    }

    this.selectHandler = this.selectHandler.bind(this);
  }

  selectHandler(e) {
    this.setState({
      userType: e.target.value
    });
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
              name="type" 
              defaultValue="select"
              onChange={this.selectHandler}
            >
              <option name="select" value="">Select User Type</option>
              <option name="tenant" value="tenant">Tenant</option>
              <option name="manager" value="manager">Manager</option>
            </select>
          </div>
          
          <div>
            Full Name:
            <input name="full-name" placeholder="Enter Full Name"/>
          </div>

          <div>
            Email:
            <input name="email" placeholder="Enter Email"/>
          </div>

          <div>
            Username:
            <input name="username" placeholder="Enter Username"/>
          </div>

          <div>
            Phone:
            <input name="phone" placeholder="Phone Number"/>
          </div>

          <div>
            Password:
            <input name="password" placeholder="Enter Password"/>
          </div>
        </form>

        {/* Conditional properties form based on selected user type */}
        {
          !this.state.userType ? null :
          this.state.userType === 'tenant' ? 
            <div>
              Property (Tenant):
            </div>
          :
          this.state.userType === 'manager' ? 
            <div>
              Property (Manager):
            </div>
          : null
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