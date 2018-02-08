import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setProfileEditState } from '../../actions/setProfileEditState';
// import { withRouter } from 'react-router';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setProfileEditState(0);
  }

  componentDidUpdate() {
    (this.props.profileEditState === 1) ?
      (document.getElementsByName('email')[0].value = localStorage.getItem('email') ? 
        localStorage.getItem('email')
        : 
        null,
      document.getElementsByName('full_name')[0].value = localStorage.getItem('full_name') ? 
        localStorage.getItem('full_name')
        : 
        null,
      document.getElementsByName('username')[0].value = localStorage.getItem('username') ? 
        localStorage.getItem('username') 
        : 
        null,
      document.getElementsByName('phonenumber')[0].value = localStorage.getItem('phonenumber') ? 
        localStorage.getItem('phonenumber')
        : 
        null) 
      : 
      null;
  }

  async onEditHandler() {
    await this.props.setProfileEditState(1);
  }

  async onUpdateHandler() {
    // sylvain pls stuff me
    console.log('stuff me sylvain');
    // handle updating passwords via bcrypt
    // add any additional fields i.e. properties, secret key (managers), etc.
  }

  async onCancelHandler() {
    await this.props.setProfileEditState(0);
  }

  render() {
    return (
      <div>
        <h3>PROFILE</h3><br/>
        {localStorage.getItem('type') === '0' ?
          <div>
            <h5>MEMBERS ONLY</h5>
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
                FULL NAME: <input type='text' name='full_name'></input><br/>
                EMAIL: <input type='text' name='email'></input><br/>
                USERNAME: <input type='text' name='username'></input><br/>
                PASSWORD: <input type='text' name='password' defaultValue='replaceme'></input><br/>
                PHONE NUMBER: <input type='text' name='phonenumber'></input><br/>
                <button onClick={this.onUpdateHandler.bind(this)}>UPDATE</button>
                <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button>
              </div>
            }
          </div>
          :
          <div>
            <h5>OWNERS ONLY</h5>
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
                FULL NAME: <input type='text' name='full_name'></input><br/>
                EMAIL: <input type='text' name='email'></input><br/>
                USERNAME: <input type='text' name='username'></input><br/>
                PASSWORD: <input type='password' name='password' defaultValue='replaceme'></input><br/>
                PHONE NUMBER: <input type='text' name='phonenumber'></input><br/>
                <button onClick={this.onUpdateHandler.bind(this)}>UPDATE</button>
                <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button>
              </div>
            }
          </div>
        }
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