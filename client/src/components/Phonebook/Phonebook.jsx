import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PhonebookEntry from './PhonebookEntry.jsx';
import PhonebookEntryForm from './PhonebookEntryForm.jsx';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
// import { withRouter } from 'react-router';
import { setPhonebookData } from '../../actions/setPhonebookData';
import axios from 'axios';

class Phonebook extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    console.log('component mounting, here is userData', this.props.userData);
    // use redux currentProperty to query below
    const { data } = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    await this.props.setPhonebookData(data);
  }

  async onCancelHandler() {
    await this.props.setPhonebookEditState(false);
  }

  render() {
    return (
      <div>
        Phonebook Says Hello!
        <br/><br/>
        PHONEBOOK DATA:
        <br/><br/>
        {this.props.phonebookEditState === true ? this.props.currentPhonebookEntry ? <div> <PhonebookEntryForm data={this.props.currentPhonebookEntry} /> <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button> </div> : 'THIS IS BAD' : this.props.phonebookData ? this.props.phonebookData.map( entry => { return <PhonebookEntry key={entry.id} data={entry}/> }) : null }
        <br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    phonebookData: state.phonebookData,
    phonebookEditState: state.phonebookEditState,
    currentPhonebookEntry: state.currentPhonebookEntry
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookData:setPhonebookData,
    setPhonebookEditState:setPhonebookEditState
    // setUserData:setUserData
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Phonebook));