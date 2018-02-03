// company text
// service text
// contactInfo text
// foreign key propertyId
// require('babel-polyfill');
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import PhonebookEntry from './PhonebookEntry.jsx';
// import { withRouter } from 'react-router';
import { setPhonebookData } from '../../actions/setPhonebookData';
import axios from 'axios';

class Phonebook extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    console.log('component mounting, here is userData', this.props.userData);
    const { data } = await axios.get(`http://localhost:3396/api/phonebooks/1`);
    console.log('this is data!!', data);
    await this.props.setPhonebookData(data);
   }
    // query the phonebook table w/ respective active propertyId
  // async onSubmitHandler() {
  //   await this.props.setUserData('helloworld')
  //   const payload = {
  //     username: document.getElementsByName('username')[0].value,
  //     password: document.getElementsByName('password')[0].value
  //   }
  //   const d = payload.username.length && payload.password.length ? await axios.post('http://localhost:3396/api/auth/login', payload) : {};
  //   d.data ? (this.props.setUserData(d.data), this.props.history.push('/')) : console.log('bad username and/or bad password');
  // }

  render() {
    return (
      <div>
        Phonebook Says Hello!
        <br/><br/>
        PHONEBOOK DATA:
        {this.props.phonebookEditState === true ? 'EDITING' : 'NOT EDITING'}
        {this.props.phonebookData ? this.props.phonebookData.map( entry => { return <PhonebookEntry data={entry}/> }) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData,
    phonebookData: state.phonebookData,
    phonebookEditState: state.phonebookEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPhonebookData:setPhonebookData
    // setUserData:setUserData
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(Phonebook));