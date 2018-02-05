import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';


class ArticleEntry extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <div className="">{JSON.stringify(this.props)}</div>  
        <button onClick={this.onEditHandler.bind(this)}>EDIT</button>
      </div>
    )
  }
}

const mapStateToProps = state => { 
  return {
    userData: state.userData,
    // articlesData: state.articlesData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    // setArticlesData: setArticlesData // get a post mosterajsdkfl
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleEntry);