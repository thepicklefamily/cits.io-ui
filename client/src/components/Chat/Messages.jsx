import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setClickedUserData } from '../../actions/setClickedUserData';
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
      userId: null,
      roomname: '',
      type: ''
    }
    this.config = {
      headers: {
        authorization: ''
      }
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
  }
  componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    axios.get(`http://localhost:3396/api/chat/getMessages`, this.config)
      .then((res) => {
        this.setState({
          messages: res.data
        })
      })
      .catch(() => {
        console.log('error fetching messages.  WHOOPS!');
      })
    const socket = io(`http://localhost:4155`, {
      query: {
        roomId: location.pathname.slice(1) //this will change to the room of the property that I put into the URL
      }
    })
    console.log('messages', socket)
    socket.on('connect', () => {
      socket.emit('client.ready', 'all');
    })
    socket.on('server.initialState', () => {
      this.setState({
        socket,
        roomname: location.pathname.slice(1)
      })
    })
    socket.on('server.message', async (data) => {
      // const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`, this.config) // // this was unneccessary
      await this.setState({
        messages: [...this.state.messages, data]
      })
      function updateScroll() {
        let element = element.getElementById('messageScroll');
        element.scrollTop = element.scrollHeight;
      }
      updateScroll();
    })
    let type = '';
    if (localStorage.getItem('type') === '1') {
      type = 'manager';
    } else {
      type = 'tenant';
    }
    this.setState({
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('id'),
      type,
    })
  }
  componentDidMount() {
    let element = document.getElementById('messageScroll');
    element.scrollTop = element.scrollHeight;
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleKeyPress(e) {
    if (e.keyCode === 13) {
      this.handleClick(e);
    }
  }
  async handleClick(e) {
    e.preventDefault();
    if (document.getElementById('message').value === '') {
      return;
    }
    const payload = {
      message: this.state.message,
      username: this.state.username,
      userId: this.state.userId,
      roomname: this.state.roomname,
      type: this.state.type
    }
    try {
      const data = await axios.post(`http://localhost:3396/api/chat/addMessage`, payload, this.config)
      data.data ? this.state.socket.emit('client.message', (data.data)) : console.log('error retrieving data');
    } catch (err) {
      console.log('error', err);
    }
    document.getElementById('message').value = '';
  }
  async goToProfile(e) {
    e.preventDefault();
    try {
      const { data } = await axios.get(`http://localhost:3396/api/users/fetch/${e.target.name}`, this.config)
      delete data[0].password
      delete data[0].type
      const payload = data;
      this.props.setClickedUserData(payload)
    } catch (err) {
      console.log('userProfile err ', err);
    }
    this.props.changeHistory();
  }
  render() {
    return (
      <div className="messagesMain">
        <h2 id="messagesPropertyName">PROPERTY NAME</h2>
        <div id="messageScroll" className="messagesInner">
          <ul>
            {this.state.messages.map((message, i) => (
              <div className="messageHolder" key={i}>
                <li>
                  <div className="messageUser">
                    <a
                      onClick={this.goToProfile}
                      name={message.userId}>{message.username}
                      </a> ({message.type})
                  </div>
                  <div className="messageContent">
                    {message.message}<span id="moment">{moment(message.date).fromNow()}</span>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="messagesSubmit">
          <input 
            onKeyUp={this.handleKeyPress} 
            id="message"
            onChange={this.handleChange} 
            type="text" name="message" 
            autoComplete="off"
            placeholder="Write a message..."
          >
          </input>
          <button onClick={this.handleClick} type="submit">Send</button>
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
    setClickedUserData: setClickedUserData
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Messages);