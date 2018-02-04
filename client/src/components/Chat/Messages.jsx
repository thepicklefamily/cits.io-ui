import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import moment from 'moment';

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      messages: [],
      message: '',
      username: '',
      roomname: '',
      type: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.hangleChange.bind(this);
  }
  componentWillMount() {
    const socket = io.connect(`http://localhost:4155`, {
      query: {
        roomId: 'ROOMNAME'
      }
    })
    console.log('hey', socket);
    socket.on('connect', () => {
      socket.emit('client.ready', 'SWAP WITH ROOM NAME AT SOME POINT');
    })
    socket.on('server.initialState', () => {
      this.setState({ socket })
    })
    socket.on('server.message', async (data) => {
      console.log('message heard', data);
      try {
        const messages = await axios.get(`http://localhost:3396/api/chat/getMessages`)
        await this.setState({
          messages: messages.data
        })
      } catch (err) {
        console.log('error fetching messages');
      }
      
    })
  }
  hangleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  async handleClick(e) {
    e.preventDefault();
    const payload = {
      message: this.state.message,
      username: 'USER',
      roomname: 'ROOMNAME',
      type: 'TENANT OR MANAGER'
    }
    try {
      const data = await axios.post(`http://localhost:3396/api/chat/addMessage`, payload)
      data.data ? this.state.socket.emit('client.message', (data.data)) : console.log('error retrieving data');
      console.log('here?', data.data);
    } catch (err) {
      console.log('error', err);
    }
  }
  render() {
    return (
      <div>
        <div>
          <ul>
            {this.state.messages.map((message, i) => (
              <div key={i}>
                <li>{message.username}: {message.message} {moment(message.date).fromNow()}</li>
              </div>
            ))}
          </ul>
        </div>
        <input onChange={this.handleChange} type="text" name="message"></input>
        <button onClick={this.handleClick} type="submit">SUBMIT</button>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Messages);