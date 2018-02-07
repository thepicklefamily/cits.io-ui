require('babel-polyfill');
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropertySearch from './PropertySearch';
import { setUserData } from '../../actions/setUserData';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userType: null,
      full_name: '',
      email: '',
      username: '',
      phone: '',
      password: '',
      propName: '',
      propAddress: '',
      propSecret: '',
      userID: null,
      propertyID: null,
      apt_unit: '',
      currentProperty: null
    }

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.selectProperty = this.selectProperty.bind(this);
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => { console.log(this.state.apt_unit) });
  }

  async selectProperty(propertyID, secret) {
    if (this.state.userType === '1' && propertyID) {
      const selectedProperty = await axios.get(`http://localhost:3396/api/properties/fetch/ID?id=${propertyID}`);
      
      if (selectedProperty.data[0].secret_key === secret) {
        this.setState({ propertyID }, () => { console.log('Selected Property:', propertyID) })
      } else {
        alert('Your secret key does not match, please try again!')
      };
    } 
      else 
    {
      this.setState({ propertyID }, () => { console.log('Selected Property:', propertyID) });
    }

    if (document.getElementById('secretInputField')) {
      document.getElementById('secretInputField').value = '';
    }
  }

  async submitHandler() {
    const userBody = {
      full_name: this.state.full_name,
      email: this.state.email,
      phonenumber: this.state.phone,
      username: this.state.username,
      password: this.state.password,
      type: this.state.userType
    };

    const propBody = {
      name: this.state.propName,
      address: this.state.propAddress,
      secret_key: this.state.propSecret
    }

    const newUser = await axios
      .post('http://localhost:3396/api/auth/signup', userBody);

    this.setState({ 
      userID: newUser.data.id 
    });

    if (this.state.propName && this.state.propAddress && this.state.propSecret) {
      const newProp = await axios
        .post('http://localhost:3396/api/properties/create', propBody);
      
      this.setState({ 
        propertyID: newProp.data.id 
      });
    }

    let tempUnit = '';

    // add apartment unit to the table if it exists
    if (this.state.apt_unit) {
      const newAptUnit = await axios
      .post('http://localhost:3396/api/aptUnits/create', {
        unit: this.state.apt_unit
      });
      tempUnit = newAptUnit;
    } 
    
    // axios to add user, prop, and apartment unit IDs to joint table
    const jointBody = {
      userID: newUser.data.id,
      propertyID: this.state.propertyID
    }
    
    this.state.userType === '0' ? jointBody.aptUnitID = tempUnit.data.id : jointBody.aptUnitID = 1;

    await axios
      .post('http://localhost:3396/api/usersPropertiesAptUnits/addUsersPropertiesAptUnits', jointBody);
 
    // set current apartment unit

    const currentProperty = await axios
      .get(`http://localhost:3396/api/properties/fetch/ID?id=${this.state.propertyID}`)
    this.props.setPropertyData(currentProperty.data);
    this.props.setCurrentProperty(currentProperty.data);

    this.props.setUserData(newUser.data);
    this.props.history.push('/');
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
              <option name="tenant" value="0">Tenant</option>
              <option name="manager" value="1">Manager</option>
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
              type="password"
              name="password" 
              placeholder="Enter Password"
              onChange={this.inputChangeHandler}
            />
          </div>
        </form>

        {/* Conditional properties form based on selected user type */}
        {
          !this.state.userType ? null :
          this.state.userType === "0" ? 
            <div>
              Property (Tenant):
              <PropertySearch
                propertyID={this.state.propertyID}
                selectProperty={this.selectProperty}
                inputChangeHandler={this.inputChangeHandler}
                userType={this.state.userType} 
              />
              {
                !this.state.propertyID ? null :
                <div>
                  Apartment Number/Unit:
                  <input 
                    name="apt_unit"
                    placeholder="Enter Unit Number"
                    onChange={this.inputChangeHandler}
                  />
                </div>
              }
            </div>
          :
          this.state.userType === "1" ? 
            <div>
              Property (Manager):
              <PropertySearch 
                propertyID={this.state.propertyID}
                selectProperty={this.selectProperty}
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
    setUserData: setUserData,
    setPropertyData: setPropertyData,
    setCurrentProperty: setCurrentProperty
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));