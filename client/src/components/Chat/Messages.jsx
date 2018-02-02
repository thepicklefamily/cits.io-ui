import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';

class Messages extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <form>
          <input type="text"></input>
          <button type="submit">SUBMIT</button>
        </form>
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