import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';
import moment from 'moment';
import axios from 'axios';

class Members extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      socket: null,
      activeUsers: {},
      allUsersInProperty: [],
      render: true
    }

    this.config = {
      headers: {
        authorization: ''
      }
    };
  }
      
  async componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.SOCKET_URL = (process.env.NODE_ENV === 'production') ? process.env.SOCKET_SERVER_AWS_HOST : process.env.SOCKET_SERVER_LOCAL_HOST;
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;

    // const socket = io.connect('http://localhost:4155', {
    //   query: {
    //     roomId: location.pathname.slice(1)
    //   }
    // })
    // console.log('yoooooo', socket);
    // socket.on('connect', () => {
    //   console.log('getting to connect in client');
    //   socket.emit('client.ready', 'all');
    // })
    // socket.on('server.initialState', () => {
    //   this.setState({ socket })
    // })
    // socket.on('server.message', async (data) => {
    //   try {
    //     // const message = await axios.get(`http://localhost:3396/api/chat/getMostRecentMessage`, this.config) // // this was unneccessary
    //     await this.setState({
    //       messages: [...this.state.messages, data]
    //     })
    //   } catch (err) {
    //     console.log('error fetching messages');
    //   }
    // })

    const socket = io.connect(`${this.SOCKET_URL}/active-users`);
    socket.on('connect', () => {
      console.log('Client connected to active-users socket');

      this.setState({ socket });

      socket.emit('login', {
        username: localStorage.getItem('username'),
        type: localStorage.getItem('type')
      });

      socket.on('login', (data) => {
        if (!this.state.activeUsers[data.username]) {
          this.state.activeUsers[data.username] = data.type;
        }

        socket.emit('active', {
          username: localStorage.getItem('username'),
          type: localStorage.getItem('type')
        });

        this.setState({ render: !this.state.render });
      });

      socket.on('active', (data) => {
        if (!this.state.activeUsers[data.username]) {
          this.state.activeUsers[data.username] = data.type;
        }
        this.setState({ render: !this.state.render });
        console.log('AFTER ACTIVE EMIT:', this.state.activeUsers);
      });
      
      socket.on('inactive', (data) => {
        if (this.state.activeUsers[data.username]) {
          delete this.state.activeUsers[data.username];
        }
        this.setState({ render: !this.state.render });
        console.log('DELETED THE USER, REMAINING:', this.state.activeUsers);
      }); 
      
      socket.on('disconnect', () => {
        console.log('clientside- this client has disconnected');
      });
    });

    const allUsers = await axios
      .get(`${this.REST_URL}/api/usersPropertiesAptUnits/getByPropertyId?propertyID=${localStorage.getItem('propertyId')}`, this.config);
    
    await this.setState({
      allUsersInProperty: allUsers.data
    });
  }

  async componentWillUnmount() {
    // let server know the user that is disconnecting
    await this.state.socket.emit('inactive', {
      username: localStorage.getItem('username')
    });
    
    // disconnect client socket
    await this.state.socket.disconnect();
    console.log('Client has disconnected from active-users socket');
  }

  render() {
    return (
      <div className="membersMain">
        Members
        <div>
          <ul>
            {
              this.state.allUsersInProperty.map(user =>
                user.username === localStorage.getItem('username') ? null :
                !this.state.activeUsers.hasOwnProperty(user.username) ? null :
                <li key={user.id}>
                  Active:
                  <span>{user.username}</span>
                  {
                    user.type === '0' ?
                    <span>(Tenant)</span>
                    :
                    <span>(Manager)</span>
                  }
                </li>
              )
            }
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