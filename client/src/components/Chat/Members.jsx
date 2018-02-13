import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';

class Members extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null
    }
  }
  componentWillMount() {
    const socket = io.connect('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    })
    console.log('hey', socket);
    socket.on('connect', () => {
      console.log('getting to connect in client');
      socket.emit('client.ready', 'all');
    })
    socket.on('server.initialState', () => {
      this.setState({ socket })
    })
  }
  render() {
    return (
      <div>
        <div>
          <ul>
            <li>Steve</li>
            <li>Jim</li>
            <li>Chad</li>
            <li>Fred</li>
          </ul>
        </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(Members);