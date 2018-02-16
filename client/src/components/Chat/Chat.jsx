import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Members from './Members';
import Messages from './Messages';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';

class Chat extends Component {
  constructor(props) {
    super(props)
    this.config = {
      headers: {
        authorization: ''
      }
    };
    this.state = {
      propName: ''
    }
    this.changeHistory = this.changeHistory.bind(this);
  }
  async componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.SOCKET_URL = (process.env.NODE_ENV === 'production') ? process.env.SOCKET_SERVER_AWS_HOST: process.env.SOCKET_SERVER_LOCAL_HOST;

    let property = await axios.get(`${this.REST_URL}/api/properties/fetch/ID?id=${localStorage.getItem('propertyId')}`);
    localStorage.setItem('propName', property.data[0].name);
    this.setState({propName: localStorage.getItem('propName')});
  }

  changeHistory() {
    this.props.history.push('/userProfile');
  }

  render() {
    return (
      <div className="container">
        <h4 className="title">{this.state.propName}</h4>
        <div className="row">
          <Members />
          <Messages changeHistory={this.changeHistory}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentProperty: state.currentProperty
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Chat);