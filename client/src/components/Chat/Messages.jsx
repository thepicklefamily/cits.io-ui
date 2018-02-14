import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { setClickedUserData } from '../../actions/setClickedUserData';
import { setNotificationProperties } from '../../actions/setNotificationProperties';
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
      try {
        //sending confirmation back to server that saw message (for chat notifications):
        this.props.chatNotificationSocket.emit('message.received', { 
          userId: localStorage.getItem('id'),
          propId: data.propId,
          timeStamp: data.timeStamp
        });
        //other chat logic:
        const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`, this.config)
        await this.setState({
          messages: [...this.state.messages, data]
        })
      } catch (err) {
        console.log('error fetching messages', err);
      }

    })
    let type = '';
    if (localStorage.getItem('type') === '1') {
      type = 'Manager';
    } else {
      type = 'Tenant';
    }
    this.setState({
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('id'),
      type,
    })

    this.props.notificationProperties ? this.clearNotifications() : null;
  }

  clearNotifications () {
    //clear notification once you go to chat page:
    const currentProperty = +localStorage.getItem('propertyId')
    if (this.props.notificationProperties.includes(currentProperty)) {
      document.getElementById('chatButton').innerHTML = 'Go to Chat';
      document.title = 'CITS';
      let properties = this.props.notificationProperties.slice();
      properties.splice(properties.indexOf(currentProperty), 1);
      this.props.setNotificationProperties(properties);
      //send confirmation back to server that saw messages in this chat room up to this point (for chat notifications):
      this.props.chatNotificationSocket.emit('message.received', { 
        userId: localStorage.getItem('id'),
        propId: currentProperty,
        timeStamp: Date.now()
      });
    }
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
    const timeStamp = Date.now()
    const payload = {
      message: this.state.message,
      username: this.state.username,
      userId: this.state.userId,
      roomname: 'ROOMNAME',
      type: this.state.type
    }
    try {
      const data = await axios.post(`http://localhost:3396/api/chat/addMessage`, payload, this.config)
      data.data ? 
        (data.data.propId = localStorage.getItem('propertyId'),
        data.data.timeStamp = timeStamp,
        this.state.socket.emit('client.message', (data.data)))
        :
        console.log('error retrieving data');
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
      <div>
        <div>
          <ul>
            {this.state.messages.map((message, i) => (
              <div key={i}>
                <li><a href="!" onClick={this.goToProfile} name={message.userId}>{message.username}</a> ({message.type}): {message.message} <br/>{moment(message.date).fromNow()}</li>
              </div>
            ))}
          </ul>
        </div>
        <input onKeyUp={this.handleKeyPress} id="message" onChange={this.handleChange} type="text" name="message" autoComplete="off"></input>
        <button onClick={this.handleClick} type="submit">SUBMIT</button>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    notificationProperties: state.notificationProperties,
    chatNotificationSocket: state.chatNotificationSocket
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setClickedUserData,
    setNotificationProperties
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Messages);