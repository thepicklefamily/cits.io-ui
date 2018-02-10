import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

class UserProfile extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <h1>HELLO FROM USERPROFILE</h1>
      </div>
    )
  }
}



const mapStateToProps = state => {
  return {
    
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(UserProfile));