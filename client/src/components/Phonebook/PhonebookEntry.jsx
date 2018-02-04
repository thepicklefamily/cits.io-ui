import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
import { setCurrentPhonebookEntry } from '../../actions/setCurrentPhonebookEntry';
// import axios from 'axios';

class PhonebookEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  async onEditHandler() {
    await this.props.setCurrentPhonebookEntry(this.state.data); // must be above otherwise entry will render previous selection
    await this.props.setPhonebookEditState(!this.props.phonebookEditState || true); // on submit edit form, revert to false
  }

  render() {
    return (
      <div>
        Phonebook Entry: <br/>
        {JSON.stringify(this.state.data)}
        <button onClick={this.onEditHandler.bind(this)}>EDIT</button>
        <br/><br/>
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
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(PhonebookEntry));