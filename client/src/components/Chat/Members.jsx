import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import io from 'socket.io-client/dist/socket.io.js';

class Members extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
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