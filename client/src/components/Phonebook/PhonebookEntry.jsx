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

  async onAddHandler() {
    await this.props.setCurrentPhonebookEntry({});
    await this.props.setPhonebookEditState('1');
  }

  async onEditHandler() {
    await this.props.setCurrentPhonebookEntry(this.state.data); // must be above otherwise entry will render previous selection
    await this.props.setPhonebookEditState('2'); // on submit edit form, revert to false
  }

  render() {
    return (
      <div>
        Phonebook Entry: <br/>
        COMPANY: {this.state.data.company} <br/>
        SERVICE: {this.state.data.service} <br/>
        CONTACT INFO: {this.state.data.contactinfo} <br/>
        {this.props.userData.type === 1 ? 
          <button onClick={this.onEditHandler.bind(this)}>EDIT ENTRY</button> 
          : 
          null
        }
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData:state.userData,
    phonebookEditState:state.phonebookEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(PhonebookEntry));