import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.goBack = this.goBack.bind(this);
  }
  componentDidMount() {
    console.log(this.props.clickedUserData);
  }
  goBack() {
    this.props.history.push('/chat');
  }
  render() {
    let user = this.props.clickedUserData[0]
    return (
      <div>
        <h3>User Profile</h3>
        <ul>
          <li>Name: {user.full_name}</li>
          <li>Phone: {user.phonenumber}</li>
          <li>email: {user.email}</li>
        </ul>
        <button onClick={this.goBack}>Back to Chat</button>
      </div>
    )
  }
}



const mapStateToProps = state => {
  return {
    clickedUserData: state.clickedUserData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(UserProfile));