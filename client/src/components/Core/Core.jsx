import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

import './Core.css';

class Core extends Component {
  constructor(props) {
    super(props);

    this.goToPage = this.goToPage.bind(this);
  }

  goToPage(str) {
    this.props.history.push(str);
  }

  render() {
    return (
      <div className="container">
        {localStorage.getItem('token') ? 
        <LoggedIn 
          goToPage = {this.goToPage}
        /> 
        :
        <LoggedOut />}
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
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Core);