import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Members from './Members';
import Messages from './Messages';
import { Route, Switch } from 'react-router-dom';
import io from 'socket.io-client/dist/socket.io.js';

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null
    }
  }
  componentWillMount() {
    const socket = io('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    })
    this.setState({
      socket: this.socket
    })
    console.log(this.state);
  }
  render() {
    return (
      <div>
        <Members />
        <Messages />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    //
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Chat);