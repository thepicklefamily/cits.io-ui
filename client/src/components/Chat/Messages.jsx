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
      try {
        // const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`, this.config) // // this was unneccessary
        await this.setState({
          messages: [...this.state.messages, data]
        })
      } catch (err) {
        console.log('error fetching messages');
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
  }

  //will save the time that the user left chat. for notifications.
  setPropIDTimeStampTuples() {
    let prevLocalStorage = localStorage.getItem('propIDTimeStampTuples')
    prevLocalStorage ? 
      localStorage.setItem('propIDTimeStampTuples', `${prevLocalStorage}|${localStorage.getItem('propertyId')},${Date.now()}`)
      :
      localStorage.setItem('propIDTimeStampTuples', `${localStorage.getItem('propertyId')},${Date.now()}`)
  }

  componentWillUnmount () {
        //can set time here onto localStorage. however, what if switch props while in chat? chat doesn't unmount then...
        //so will have to add function in navbar to set time when switch props while window.location.href === "http://localhost:3000/chat" too.
        console.log('Chat\'s Messages Component has been unmounted!');
        this.setPropIDTimeStampTuples(); 
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
      console.log(this.state, 'state');
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
    chatNotificationSocket: state.chatNotificationSocket
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setClickedUserData: setClickedUserData
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Messages);