import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setProfileEditState } from '../../actions/setProfileEditState';
import { setSearchResults } from '../../actions/setSearchResults';
// import { withRouter } from 'react-router';
import axios from 'axios';
import PropertyListItem from './PropertyListItem';
import PropertySearch from '../Auth/PropertySearch';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: localStorage.getItem('full_name'),
      email: localStorage.getItem('email'),
      username: localStorage.getItem('username'),
      phonenumber: localStorage.getItem('phonenumber'),
      userType: localStorage.getItem('type'),
      password: '',
      new_password: '',
      confirm_password: '',
      propertyData: [],
      propName: '',
      propAddress: '',
      propSecret: '',
      propertyID: null,
      apt_unit: '',
    };

    this.config = {
      headers: {
        authorization: ''
      }
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.updateUserHandler = this.updateUserHandler.bind(this);
    this.onCancelHandler = this.onCancelHandler.bind(this);
    this.setPropertyData = this.setPropertyData.bind(this);
    this.selectProperty = this.selectProperty.bind(this);
    this.addPropertyHandler = this.addPropertyHandler.bind(this);
  }

  componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.props.setProfileEditState(0);
    this.setPropertyData();
  }

  async setPropertyData() {
    const propertyData = await axios
      .get(`http://localhost:3396/api/usersPropertiesAptUnits/getUsersPropertiesAptUnits?userID=${localStorage.getItem('id')}`, this.config);

    await this.setState({
      propertyData: propertyData.data
    });
  }

  async selectProperty(propertyID, secret) {
    if (this.state.userType === '1' && propertyID) {
      const selectedProperty = await axios.get(`http://localhost:3396/api/properties/fetch/ID?id=${propertyID}`, this.config);
      
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

  async addPropertyHandler() {
    // if user is tenant, add unit to apt_units table
    let tempUnit = '';

    if (this.state.userType === '0') {
      const newUnit = await axios
        .post('http://localhost:3396/api/aptUnits/create', { unit: this.state.apt_unit }, this.config);
      tempUnit = newUnit;
    }

    // if property is being added, add property info to properties table
    if (this.state.propName && this.state.propAddress && this.state.propSecret) {
      const propBody = {
        name: this.state.propName,
        secret_key: this.state.propSecret,
        address: this.state.propAddress
      }

      const newProperty = await axios
        .post('http://localhost:3396/api/properties/create', propBody, this.config);

      await this.setState({ 
        propertyID: newProperty.data.id 
      });

      // empty the input fields
      console.log(document.getElementsByName('propName'))
      document.getElementsByName('propName')[0].value = '';
      document.getElementsByName('propAddress')[0].value = '';
      document.getElementsByName('propSecret')[0].value = '';
    }

    // add add relationship to joint table
    const jointBody = {
      userID: localStorage.getItem('id'),
      propertyID: this.state.propertyID
    };

    this.state.userType === '0' ? 
    jointBody.aptUnitID = tempUnit.data.id :
    jointBody.aptUnitID = 1;

    await axios
      .post('http://localhost:3396/api/usersPropertiesAptUnits/addUsersPropertiesAptUnits', jointBody, this.config);

    // reset propertyData 
    this.setPropertyData();
    
    // empty the searchResults in the redux store
    this.props.setSearchResults([]);

    // empty out the propertyID
    this.setState({ propertyID: null });
  }

  inputChangeHandler(e) {
    e.persist();
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async updateUserHandler() {
    console.log('stuff me sylvain');
    
    // updates the user's data on the database
    const userBody = {
      user_id: localStorage.getItem('id'),
      full_name: this.state.full_name,
      email: this.state.email,
      username: this.state.username,
      phonenumber: this.state.phonenumber
    }

    await axios.put('http://localhost:3396/api/users/editUser', userBody, this.config);

    // updates the users' data on the local storage
    localStorage.setItem('username', this.state.username);
    localStorage.setItem('full_name', this.state.full_name);
    localStorage.setItem('email', this.state.email);
    localStorage.setItem('phonenumber', this.state.phonenumber);

    // updates password if current password matches
    if (this.state.password && this.state.new_password && this.state.confirm_password) {
      const userData = await axios.get(`http://localhost:3396/api/users/fetch/${localStorage.getItem('id')}`, this.config);

      const passwordBody = {
        user_id: localStorage.getItem('id'),
        actualPassword: userData.data[0].password,
        password: this.state.password,
        new_password: this.state.new_password
      }

      this.state.new_password !== this.state.confirm_password ? alert('Password not updated, new password entries must match!') :
      await axios.put('http://localhost:3396/api/users/editPassword', passwordBody, this.config);
    }

    // takes user out of edit state
    await this.props.setProfileEditState(0);
  }

  async onEditHandler() {
    await this.props.setProfileEditState(1);
  }

  async onCancelHandler() {
    await this.props.setProfileEditState(0);
  }

  render() {
    return (
      <div>
        <h3>PROFILE</h3><br/>
        <div>
          {this.props.profileEditState === 0 ? 
            <div>
              <h3>Profile Info</h3>

              FULL NAME:
              <div>{localStorage.getItem('full_name')}</div><br/>

              EMAIL:
              <div>{localStorage.getItem('email')}</div><br/>
              
              USERNAME:
              <div>{localStorage.getItem('username')}</div><br/>

              PHONE NUMBER:
              <div>{localStorage.getItem('phonenumber')}</div><br/>

              <button onClick={this.onEditHandler.bind(this)}>EDIT</button>
            </div> 
            : 
            <div>
              <h3>Edit Profile Info</h3>
              FULL NAME: 
              <div>
                <input 
                  type='text' 
                  name='full_name' 
                  onChange={this.inputChangeHandler} 
                  defaultValue={localStorage.getItem('full_name')}
                />
              </div><br/>

              EMAIL: 
              <div>
                <input 
                  type='text' 
                  name='email' 
                  onChange={this.inputChangeHandler} 
                  defaultValue={localStorage.getItem('email')}
                />
              </div><br/>

              USERNAME: 
              <div>
                <input 
                  type='text' 
                  name='username' 
                  onChange={this.inputChangeHandler} 
                  defaultValue={localStorage.getItem('username')}
                />
              </div><br/>

              PHONE NUMBER: 
              <div>
                <input 
                  type='text' 
                  name='phonenumber' 
                  onChange={this.inputChangeHandler} 
                  defaultValue={localStorage.getItem('phonenumber')}
                />
              </div><br/>

              PASSWORD: 
              <div>
                <div>
                  Current password:
                  <div>
                    <input 
                      type='password' 
                      name='password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='Enter your current password'
                    />
                  </div>
                </div><br/>

                <div>
                  New password:
                  <div>
                    <input 
                      type='password' 
                      name='new_password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='Enter your new password'
                    />
                  </div>
                </div><br/>

                <div>
                  Confirm new password:
                  <div>
                    <input 
                      type='password' 
                      name='confirm_password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='Confirm new password'
                    />
                  </div>
                </div>
              </div><br/>

              <button onClick={this.updateUserHandler}>SAVE CHANGES</button>
              <button onClick={this.onCancelHandler}>CANCEL</button>
            </div>
          }
          {
            // your properties
            <div>
              <h3>Properties Info</h3>
              <ul>
                {
                  this.state.propertyData.map(property => 
                    <PropertyListItem 
                      key={property.id} // if someone has multiple units at the same property, this will throw an error in the console.
                      property={property}
                      setPropertyData={this.setPropertyData}
                    />
                  )
                }
              </ul>
            </div>
          }
          {
            // search properties
            <div>
              <h3>Add Property</h3>
              <PropertySearch 
                propertyID={this.state.propertyID}
                selectProperty={this.selectProperty}
                inputChangeHandler={this.inputChangeHandler}
                userType={localStorage.getItem('type')}
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
              <button onClick={this.addPropertyHandler}>Add Property to Account</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profileEditState: state.profileEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setProfileEditState,
    setSearchResults
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);