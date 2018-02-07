import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';


class TicketEntry extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        Ticket Entry: <br/>
        subject: {`${this.props.data.subject} `}
        category: {`${this.props.data.category} `}
        apt_num: {this.props.data.apt_num} <br/>
        description: {this.props.data.description} <br/>
        status: {this.props.data.status} <br/>
        {this.props.userData.type === 1 ? 
          <button onClick={console.log('hi')}>EDIT ENTRY</button> 
          : 
          null
        }
        <br/><br/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData:state.userData

  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    
    
  }, dispatch);
};

export default (connect(mapStateToProps, matchDispatchToProps)(TicketEntry));
