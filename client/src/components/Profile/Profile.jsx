import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setProfileEditState } from '../../actions/setProfileEditState';
// import { withRouter } from 'react-router';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      full_name: localStorage.getItem('full_name'),
      email: localStorage.getItem('email'),
      username: localStorage.getItem('username'),
      phonenumber: localStorage.getItem('phonenumber')
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount() {
    this.props.setProfileEditState(0);
  }

  async onEditHandler() {
    await this.props.setProfileEditState(1);
  }

  async onUpdateHandler() {
    console.log('stuff me sylvain');
    // handle updating passwords via bcrypt
    
    const updateBody = {
      user_id: localStorage.getItem('id'),
      full_name: this.state.full_name,
      email: this.state.email,
      username: this.state.username,
      phonenumber: this.state.phonenumber
    }

    await axios.put('http://localhost:3396/api/users/edit', updateBody);

    localStorage.setItem('username', this.state.username);
    localStorage.setItem('full_name', this.state.full_name);
    localStorage.setItem('email', this.state.email);
    localStorage.setItem('phonenumber', this.state.phonenumber);

    await this.props.setProfileEditState(0);
  }

  async onCancelHandler() {
    await this.props.setProfileEditState(0);
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div>
        <h3>PROFILE</h3><br/>
        <div>
          <br/>
          {this.props.profileEditState === 0 ? 
            <div>
              FULL NAME:<div>{localStorage.getItem('full_name')}</div><br/>
              EMAIL:<div>{localStorage.getItem('email')}</div><br/>
              USERNAME:<div>{localStorage.getItem('username')}</div><br/>
              PHONE NUMBER:<div>{localStorage.getItem('phonenumber')}</div><br/>
              <button onClick={this.onEditHandler.bind(this)}>EDIT</button></div> 
            : 
            <div>
              FULL NAME: 
              <input 
                type='text' 
                name='full_name' 
                onChange={this.inputChangeHandler} 
                defaultValue={localStorage.getItem('full_name')}
              /><br/>

              EMAIL: 
              <input 
                type='text' 
                name='email' 
                onChange={this.inputChangeHandler} 
                defaultValue={localStorage.getItem('email')}
              /><br/>

              USERNAME: 
              <input 
                type='text' 
                name='username' 
                onChange={this.inputChangeHandler} 
                defaultValue={localStorage.getItem('username')}
              /><br/>

              PHONE NUMBER: 
              <input 
                type='text' 
                name='phonenumber' 
                onChange={this.inputChangeHandler} 
                defaultValue={localStorage.getItem('phonenumber')}
              /><br/>

              <button onClick={this.onUpdateHandler.bind(this)}>SAVE CHANGES</button>
              <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    profileEditState: state.profileEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setProfileEditState:setProfileEditState
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Profile));