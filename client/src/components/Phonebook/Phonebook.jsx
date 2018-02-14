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
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount() {
    this.props.setPhonebookEditState('0');
    this.config.headers.authorization = await localStorage.getItem('token'); 
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    const { data } = await axios.get(`${this.REST_URL}/api/phonebooks/${localStorage.getItem('propertyId')}`, this.config);
    await this.props.setPhonebookData(data);
  }

  async onAddHandler() {
    await this.props.setCurrentPhonebookEntry({});
    await this.props.setPhonebookEditState('1');
  }

  render() {
    return (
      <div>
        PHONEBOOK DATA:
        <br/><br/>
        {(this.props.currentPhonebookEntry && this.props.phonebookEditState !== '0' && localStorage.getItem('type') === '1' ? 
          <div>
            <PhonebookEntryForm/>
          </div> 
          : 
          this.props.phonebookData ? 
            this.props.phonebookData.map( entry => <PhonebookEntry key={entry.id} data={entry}/> ) 
            : 
            'No DATA'
          )
        }
        {this.props.phonebookEditState === '0' && localStorage.getItem('type') === '1' ? 
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

export default connect(mapStateToProps, matchDispatchToProps)(Phonebook);