import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      message: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.hangleChange.bind(this);
  }
  componentWillMount() {
    const socket = io.connect('http://localhost:4155', {
      query: {
        roomId: 'ROOMNAME'
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
  hangleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleClick() {
    
  }
  render() {
    return (
      <div>
        <input onChange={this.handleChange} type="text" name="message"></input>
        <button onClick={this.handleClick} type="submit">SUBMIT</button>
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

export default connect(mapStateToProps, matchDispatchToProps)(Messages);