import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
import { setCurrentPhonebookEntry } from '../../actions/setCurrentPhonebookEntry';

class PhonebookEntry extends Component {
  constructor(props) {
    super(props);
  }

  async onEditHandler() {
    await this.props.setCurrentPhonebookEntry(this.props.data); // must be above otherwise entry will render previous selection
    await this.props.setPhonebookEditState('2'); // on submit edit form, revert to false
  }

  render() {
    return (
      <div className='phonebookInnerEntry'>
        <div className='phonebookEntryRows'>
          <div className='phonebookEntryRowCompany'>
            {this.props.data.company} <br/>
          </div>
          <div className='phonebookEntryRowService'>
            {this.props.data.service} <br/>
          </div>
          <div className='phonebookEntryRowNumber'>
            {this.props.data.contactinfo} <br/>
          </div>
        </div>
        <div className='phonebookEditButton'>
          {localStorage.getItem('type') === '1' ? 
            <button className='phonebookButtons' onClick={this.onEditHandler.bind(this)}>EDIT ENTRY</button> 
            : 
            null
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    phonebookEditState:state.phonebookEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookEditState:setPhonebookEditState,
    setCurrentPhonebookEntry:setCurrentPhonebookEntry
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PhonebookEntry);
