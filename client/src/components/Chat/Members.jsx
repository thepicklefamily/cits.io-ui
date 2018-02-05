import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';

class Members extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    const socket = io.connect('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    })
    console.log('hey', socket);
    socket.on('connect', () => {
      console.log('getting to connect in clinet');
      socket.emit('client.ready', 'SWAP WITH ROOM NAME AT SOME POINT');
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