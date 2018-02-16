import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setPhonebookEditState } from '../../actions/setPhonebookEditState';
import { setPhonebookData } from '../../actions/setPhonebookData';
import { setCurrentPhonebookEntry } from '../../actions/setCurrentPhonebookEntry';
import axios from 'axios';

class PhonebookEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phonebookError: false
    }
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
  }

  componentDidMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    document.getElementsByName('company')[0].value = this.props.currentPhonebookEntry.company ? 
      this.props.currentPhonebookEntry.company 
      : 
      null;
    document.getElementsByName('service')[0].value = this.props.currentPhonebookEntry.service ? 
      this.props.currentPhonebookEntry.service 
      : 
      null;
    document.getElementsByName('contactinfoone')[0].value = this.props.currentPhonebookEntry.contactinfo ? 
      this.props.currentPhonebookEntry.contactinfo.slice(0, 3) 
      : 
      null;
    document.getElementsByName('contactinfotwo')[0].value = this.props.currentPhonebookEntry.contactinfo ? 
      this.props.currentPhonebookEntry.contactinfo.slice(3, 6) 
      : 
      null;
    document.getElementsByName('contactinfothree')[0].value = this.props.currentPhonebookEntry.contactinfo ? 
      this.props.currentPhonebookEntry.contactinfo.slice(6, 10) 
      : 
      null;
  }

  async onAddHandler() {
    const payload = this.props.phonebookEditState === '1' ? 
      {
        propertyId: localStorage.getItem('propertyId'),
        company: document.getElementsByName('company')[0].value.toString(),
        service: document.getElementsByName('service')[0].value.toString(),
        contactInfo: parseInt(document.getElementsByName('contactinfoone')[0].value.toString() + document.getElementsByName('contactinfotwo')[0].value.toString() + document.getElementsByName('contactinfothree')[0].value.toString()) >= 2000000000 ? document.getElementsByName('contactinfoone')[0].value.toString() + document.getElementsByName('contactinfotwo')[0].value.toString() + document.getElementsByName('contactinfothree')[0].value.toString() : ''
      }
      :
      {
        id: this.props.currentPhonebookEntry.id.toString(),
        company: document.getElementsByName('company')[0].value.toString(),
        service: document.getElementsByName('service')[0].value.toString(),
        contactInfo: parseInt(document.getElementsByName('contactinfoone')[0].value.toString() + document.getElementsByName('contactinfotwo')[0].value.toString() + document.getElementsByName('contactinfothree')[0].value.toString()) >= 2000000000 ? document.getElementsByName('contactinfoone')[0].value.toString() + document.getElementsByName('contactinfotwo')[0].value.toString() + document.getElementsByName('contactinfothree')[0].value.toString() : ''
      }
    let data = null;
    try {
      data = { data } = this.props.phonebookEditState === '1' ?
        await axios.post(`${this.REST_URL}/api/phonebooks/create`, payload, this.config)
        :
        await axios.put(`${this.REST_URL}/api/phonebooks/update`, payload, this.config);
      this.setState({ phonebookError: false });
    }
    catch (err) {
      this.setState({ phonebookError: true });
    }
    const d = await axios.get(`${this.REST_URL}/api/phonebooks/${localStorage.getItem('propertyId')}`, this.config);
    this.props.setPhonebookData(d.data);
    data ? await this.props.setPhonebookEditState('0') : null;
  }

  async onDeleteHandler() {
    const url = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    await axios.delete(`${this.REST_URL}/api/phonebooks/delete/${this.props.currentPhonebookEntry.id}`, this.config);
    const d = await axios.get(`${this.REST_URL}/api/phonebooks/${localStorage.getItem('propertyId')}`, this.config);
    await this.props.setPhonebookData(d.data);
    await this.props.setPhonebookEditState('0');
  }
  
  async onCancelHandler() {
    await this.props.setPhonebookEditState('0');
  }

  render() {
    return (
      <div className='phonebookFormContainer'>
        <br/>
        {this.props.phonebookEditState !== '2' ? <div id='phonebookFormWord'>Please fill out the following fields to create a new phonebook entry!</div> : <div id='phonebookFormWord'>Please edit the following fields to update an existing phonebook entry!</div>}
        <br/><br/>
        <div className='phonebookFormRow'>
          Company:<br/><input className='phonebookFormInput' type='text' name='company'></input>
        </div>
        <div className='phonebookFormRow'>
          Service:<br/><input className='phonebookFormInput' type='text' name='service' maxLength='28'></input>
        </div>
        <div className='phonebookFormRow'>
          Phone Number:<br/><input className='phonebookFormInputOne' type='text' name='contactinfoone' maxLength='3' min='200' max='999'/> <input className='phonebookFormInputTwo' type='text' name='contactinfotwo' maxLength='3' min='000' max='999'/> <input className='phonebookFormInputThree' type='text' name='contactinfothree' maxLength='4' min='0000' max='9999'/>
        </div>
        <br/><br/>
        {this.state.phonebookError ? <div className='phonebookError'>Please check your input fields and try again!</div> : null}
        {this.props.phonebookEditState === '1' ? 
          <div>
          <button className='phonebookFormButtons' onClick={this.onAddHandler.bind(this)}>Add</button><br/>
          <button className='phonebookFormButtons' onClick={this.onCancelHandler.bind(this)}>Cancel</button>
          </div>
          : 
          null
        }
        {this.props.phonebookEditState === '2' ? 
          <div>
            <button className='phonebookFormButtons' onClick={this.onAddHandler.bind(this)}>Update</button> {''} 
            <button className='phonebookFormButtons' onClick={this.onDeleteHandler.bind(this)}>Delete</button><br/>
            <button className='phonebookFormButtons' onClick={this.onCancelHandler.bind(this)}>Cancel</button><br/>
          </div> 
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
    phonebookEditState:state.phonebookEditState,
    currentPhonebookEntry:state.currentPhonebookEntry,
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

export default connect(mapStateToProps, matchDispatchToProps)(PhonebookEntryForm);