import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setArticlesData } from '../../actions/setArticlesData'
import axios from 'axios';

// import actions from actions;

class Articles extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {
    const D = this.props.articleData ? axios.get('http://localhost:3396/api/articles/fetchAllArticles/1') : {}
    D.data ? (this.props.setArticlesData(d.data), this.props.history.push('/viewArticles')) : console.log('error bitchass')
  }
  render  () {

    return (
      <div>
        {console.log('userdata', this.props.userData)}
        {this.props.userData ? <div>{JSON.stringify(this.props.userData)}</div> : <div>NO USER DATA IN REDUX</div>}
        HELLO FROM ARTICLES
      </div>
    )
  }
}

const mapStateToProps = state => { 
  return {
    userData: state.userData,
    articleData: state.articlesData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setArticlesData,
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Articles);