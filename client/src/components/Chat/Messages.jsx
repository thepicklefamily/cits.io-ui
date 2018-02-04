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
    axios.get(`http://localhost:3396/api/chat/getMessages`)
      .then((res) => {
        this.setState({
          messages: res.data
        })
      })
      .catch(() => {
        console.log('error fetching messages.  WHOOPS!');
      })
    console.log(this.props.userData)
    const socket = io.connect(`http://localhost:4155`, {
      query: {
        roomId: 'ROOMNAME'
      }
    })
    socket.on('connect', () => {
      socket.emit('client.ready', 'SWAP WITH ROOM NAME AT SOME POINT');
    })
    socket.on('server.initialState', () => {
      this.setState({ socket })
    })
    socket.on('server.message', async (data) => {
      try {
        const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`)
        await this.setState({
          messages: [...this.state.messages, message.data[0]]
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
    if (this.state.message === '') {
      return;
    }
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
    document.getElementById('message').value = '';
  }
  render() {
    if (this.state.messages.length === 0) {
      return (
        <div>
          LOADING
        </div>
      )
    } else {
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
          <input id="message" onChange={this.handleChange} type="text" name="message"></input>
          <button onClick={this.handleClick} type="submit">SUBMIT</button>
        </div>
      )
    }
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