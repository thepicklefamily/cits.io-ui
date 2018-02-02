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
    const socket = io.connect('http://localhost:4155', {
      query: {
        roomId: 'ROOMNAME'
      }
    })
    console.log(socket);
    socket.on('connect', () => {
      console.log('getting to connect in clinet');
      socket.emit('client.ready', 'SWAP WITH ROOM NAME AT SOME POINT');
    })
    socket.on('server.initialState', () => {
      this.setState({
        socket: socket,
      })
    })
    
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