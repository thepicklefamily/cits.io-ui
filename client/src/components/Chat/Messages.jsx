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

  componentDidMount() {
    const socket = io(`${this.SOCKET_URL}`, {
      query: {
        roomId: location.pathname.slice(1) //this will change to the room of the property that I put into the URL
      }
    })
    this.setState({socket})
    socket.on('connect', () => {
      console.log('emit 1 FUUUUUUUUUUUUUUUUUUUUUUUUCK');
      socket.emit('client.ready', 'all');
    })
    
    socket.on('server.initialState', () => {
      console.log('this is the fucking socket', socket);
      this.setState({
        socket,
        roomname: location.pathname.slice(1)
      }, ()=> {
        console.log('messages', socket)
      })
    })
    
    socket.on('server.message', async (data) => {
      try {
        //sending confirmation back to server that saw message (for chat notifications):
        // if (data.propId === localStorage.getItem('propertyId') && document.hasFocus()) {
          if (data.propId === localStorage.getItem('propertyId') && window.location.href.includes('/chat')) {
          this.confirmMessagesSeen();
          console.log('mewmew')
        }
        // console.log('emit 2', data);
        // this.props.chatNotificationSocket.emit('message.received', { 
        //   userId: localStorage.getItem('id'),
        //   propId: data.propId,
        //   timeStamp: data.timeStamp
        // });

        //chat logic:
        const message = await axios.get(`${this.REST_URL}/api/chat/getMostRecentMessage`, this.config)
        await this.setState({
          messages: [...this.state.messages, data]
        })
      } catch (err) {
        console.log('error fetching messages', err);
      }

    })
  }
  componentWillMount() {
    
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.SOCKET_URL = (process.env.NODE_ENV === 'production') ? process.env.SOCKET_SERVER_AWS_HOST: process.env.SOCKET_SERVER_LOCAL_HOST;

    axios.get(`${this.REST_URL}/api/chat/getMessages`, this.config)
      .then((res) => {
        this.setState({
          messages: res.data
        })
      })
      .catch(() => {
        console.log('error fetching messages.  WHOOPS!');
      })

    const socket = io(`${this.SOCKET_URL}`, {
      query: {
        roomId: location.pathname.slice(1) //this will change to the room of the property that I put into the URL
      }
    })
    // this.setState({socket})
    // socket.on('connect', () => {
    //   console.log('emit 1 FUUUUUUUUUUUUUUUUUUUUUUUUCK');
    //   socket.emit('client.ready', 'all');
    // })
    
    // socket.on('server.initialState', () => {
    //   console.log('this is the fucking socket', socket);
    //   this.setState({
    //     socket,
    //     roomname: location.pathname.slice(1)
    //   }, ()=> {
    //     console.log('messages', socket)
    //   })
    // })
    
    // socket.on('server.message', async (data) => {
    //   try {
    //     //sending confirmation back to server that saw message (for chat notifications):
    //     console.log('emit 2');
    //     this.props.chatNotificationSocket.emit('message.received', { 
    //       userId: localStorage.getItem('id'),
    //       propId: data.propId,
    //       timeStamp: data.timeStamp
    //     });
    //     //other chat logic:
    //     const message = await axios.get(`${this.REST_URL}/api/chat/getMostRecentMessage`, this.config)
    //     await this.setState({
    //       messages: [...this.state.messages, data]
    //     })
    //   } catch (err) {
    //     console.log('error fetching messages', err);
    //   }

    // })
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

    this.props.notificationProperties.length ?
      (this.clearNotifications(),
      this.confirmMessagesSeen())
      : 
      null;

      // const clearNotifications = this.clearNotifications.bind(this);
      // window.addEventListener("focus", function() {clearNotifications()});
      // document.addEventListener("focus", function() {clearNotifications()});
  }

  clearNotifications () {
    //clear notification once you go to chat page:
    const currentProperty = +localStorage.getItem('propertyId')
    if (this.props.notificationProperties.includes(currentProperty)) {
      document.querySelectorAll(`#chat img`)[0].src = 'assets/icons/chat-icon-sm-gray.png';
      document.title = 'CITS';
      const properties = this.props.notificationProperties.filter(prop => prop !== currentProperty);
      this.props.setNotificationProperties(properties);
    }
  }
  
  confirmMessagesSeen () {
    //send confirmation back to server that saw messages in this chat room up to this point (for chat notifications):
    //for most precise accuracy, would send back timestamp of last message
    console.log('emit 3');
    this.props.chatNotificationSocket.emit('message.received', { 
      userId: +localStorage.getItem('id'),
      propId: +localStorage.getItem('propertyId'),
      timeStamp: Date.now()
    });
    console.log('last msg', this.state.messages, Date.now()); 
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
      const data = await axios.post(`${this.REST_URL}/api/chat/addMessage`, payload, this.config)
      data.data ? 
        (data.data.propId = localStorage.getItem('propertyId'),
        data.data.timeStamp = timeStamp,
        console.log('emit 4', this.state.socket),
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
      const { data } = await axios.get(`${this.REST_URL}/api/users/fetch/${e.target.name}`, this.config)
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