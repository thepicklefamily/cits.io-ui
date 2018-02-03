import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
// import axios from 'axios';

class PhonebookEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
    console.log('here are the entry details! ', this.state.data)
  }

  async onEditHandler() {
    await console.log('this is phonebookeditstate', this.props.phonebookEditState);
    await this.props.setPhonebookEditState(!this.props.phonebookEditState || true); // on submit edit form, revert to false
    await console.log('this is phonebookeditstate after', this.props.phonebookEditState);
  }

  render() {
    return (
      <div>
        Phonebook Entry!
        {JSON.stringify(this.state.data)}
        <button onClick={this.onEditHandler.bind(this)}>EDIT</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    phonebookEditState:state.phonebookEditState
    // userData: state.userData,
    // phonebookData: state.phonebookData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    // setPhonebookData:setPhonebookData
    // setUserData:setUserData
    setPhonebookEditState:setPhonebookEditState
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(PhonebookEntry));