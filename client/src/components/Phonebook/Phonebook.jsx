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
    this.props.setPhonebookEditState('0');
    const { data } = await axios.get(`http://localhost:3396/api/phonebooks/${this.props.currentProperty.id}`);
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
        PHONEBOOK DATA:
        <br/><br/>
        {(this.props.currentPhonebookEntry && this.props.phonebookEditState !== '0' && this.props.userData.type === 1 ? 
          <div>
            <PhonebookEntryForm/>
            <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button>
          </div> 
          : 
          this.props.phonebookData ? 
            this.props.phonebookData.map( entry => { 
              return <PhonebookEntry key={entry.id} data={entry}/> 
            }) 
            : 
            "No DATA"
          )
        }
        {this.props.phonebookEditState === '0' && this.props.userData.type === 1 ? 
          <button onClick={this.onAddHandler.bind(this)}>ADD NEW ENTRY</button> 
          : 
          null
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    phonebookData: state.phonebookData,
    phonebookEditState: state.phonebookEditState,
    currentPhonebookEntry: state.currentPhonebookEntry,
    currentProperty: state.currentProperty
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookData:setPhonebookData,
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Phonebook));