import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setUserData } from '../../actions/setUserData';
import { setPropertyData } from '../../actions/setPropertyData';
import { setCurrentProperty } from '../../actions/setCurrentProperty';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  // use conditionals to render different navs
  // change chat to instead push the name of the users property that they belong to

  render() {
    return (
      <div>
        { localStorage.getItem('token') ? 
          // LOGGED IN
          <div>
            <button onClick={() => this.props.history.push('/')}>Go to Home</button>
            <button onClick={() => this.props.history.push('/profile')}>Go to Profile</button>
            <button onClick={() => this.props.history.push('/phonebook')}>Go to Phonebook</button>
            <button onClick={() => this.props.history.push('/chat')}>Go to Chat</button>
            <button onClick={() => this.props.history.push('/tickets')}>Go to Tickets</button>
            <button onClick={() => this.props.history.push('/articles')}>Go to Articles</button>
            <button onClick={() => {(
              this.props.setPropertyData(null),
              this.props.setCurrentProperty(null),
              this.props.setUserData(null),
              localStorage.removeItem('token'),
              localStorage.removeItem('propertyId'),
              localStorage.removeItem('id'),
              localStorage.removeItem('type'),
              localStorage.removeItem('username'),
              localStorage.removeItem('email'),
              localStorage.removeItem('full_name'),
              localStorage.removeItem('phonenumber'),
              this.props.history.push('/')
            )}}>LOGOUT</button>
          </div> 
          : 
          // LOGGED OUT
          <div>
            <button onClick={() => this.props.history.push('/')}>Go to Home</button>
            <button onClick={() => this.props.history.push('/login')}>Go to Login</button>
            <button onClick={() => this.props.history.push('/signup')}>Go to Signup</button>
          </div>
        }  
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
    setUserData: setUserData,
    setPropertyData: setPropertyData,
    setCurrentProperty: setCurrentProperty
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Nav);