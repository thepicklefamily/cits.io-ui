import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';
import moment from 'moment';

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
    console.log('yoooooo', socket);
    socket.on('connect', () => {
      console.log('getting to connect in client');
      socket.emit('client.ready', 'all');
    })
    socket.on('server.initialState', () => {
      this.setState({ socket })
    })
    socket.on('server.message', async (data) => {
      try {
        // const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`, this.config) // // this was unneccessary
        await this.setState({
          messages: [...this.state.messages, data]
        })
      } catch (err) {
        console.log('error fetching messages');
      }

    })
  }
  render() {
    return (
      <div className="membersMain">
        Members
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