import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setProfileEditState } from '../../actions/setProfileEditState';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: localStorage.getItem('full_name'),
      email: localStorage.getItem('email'),
      username: localStorage.getItem('username'),
      phonenumber: localStorage.getItem('phonenumber'),
      password: '',
      new_password: '',
      confirm_password: ''
    };
    this.config = {
      headers: {
        authorization: ''
      }
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.updateUserHandler = this.updateUserHandler.bind(this);
    this.onCancelHandler = this.onCancelHandler.bind(this);
  }

  componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.props.setProfileEditState(0);
  }

  inputChangeHandler(e) {
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
                  Enter your current password:
                  <div>
                    <input 
                      type='password' 
                      name='password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='Current Password'
                    />
                  </div>
                </div><br/>

                <div>
                  Enter your new password:
                  <div>
                    <input 
                      type='password' 
                      name='new_password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='New Password'
                    />
                  </div>
                </div><br/>

                <div>
                  Confirm your new password:
                  <div>
                    <input 
                      type='password' 
                      name='confirm_password' 
                      onChange={this.inputChangeHandler} 
                      placeholder='Confirm New Password'
                    />
                  </div>
                </div>
              </div><br/>

              <button onClick={this.updateUserHandler}>SAVE CHANGES</button>
              <button onClick={this.onCancelHandler}>CANCEL</button>
            </div>
          }
          {

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
    setProfileEditState:setProfileEditState
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);