import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PhonebookEntry from './PhonebookEntry.jsx';
import PhonebookEntryForm from './PhonebookEntryForm.jsx';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
import { setCurrentPhonebookEntry } from '../../actions/setCurrentPhonebookEntry';
// import { withRouter } from 'react-router';
import { setPhonebookData } from '../../actions/setPhonebookData';
import axios from 'axios';

class Phonebook extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    console.log('component mounting, here is userData', this.props.userData);
    this.props.setPhonebookEditState('0');
    // use redux currentProperty to query below
    const { data } = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    await this.props.setPhonebookData(data);
  }

  async onAddHandler() {
    await this.props.setCurrentPhonebookEntry({});
    await this.props.setPhonebookEditState('1');
  }

  async onCancelHandler() {
    await this.props.setPhonebookEditState('0');
  }

  render() {
    return (
      <div>
        Phonebook Says Hello!
        <br/><br/>
        PHONEBOOK DATA:
        <br/><br/>
        {(this.props.userData.type === 1) ? 
        this.props.currentPhonebookEntry && this.props.phonebookEditState !== '0' ? 
        <div> <PhonebookEntryForm data={this.props.currentPhonebookEntry} /> <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button> </div> 
        : 
        this.props.phonebookData ? 
        this.props.phonebookData.map( entry => { return <PhonebookEntry key={entry.id} data={entry}/> }) 
        : 
        "No DATA"
        :
        this.props.phonebookData ? 
        this.props.phonebookData.map( entry => { return <PhonebookEntry key={entry.id} data={entry}/> }) :
        "NO DATA"
        }
        {this.props.phonebookEditState === '0' && this.props.userData.id === 1 ? <button onClick={this.onAddHandler.bind(this)}>ADD NEW ENTRY</button> : null}
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
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
    // setUserData:setUserData
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Phonebook));