import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentArticleEntry }from '../../actions/setCurrentArticleEntry';
import { setArticleEditState } from "../../actions/setArticleEditState";
import axios from 'axios';


class ArticleEntry extends Component {
  constructor(props) {
    super(props);
  }

  async onEditHandler() {
    await this.props.setCurrentArticleEntry(this.props.article);
    await this.props.setArticleEditState('2'); // on submit edit form, revert to false
  }

  render () {
    return (
      <div>
        Article Entry: <br/>
        {JSON.stringify(this.props.article)}
        <img src={this.props.article.photo_url}/>
        <br/><br/>
        <button onClick={() => {console.log('clicked')}}>More Info</button> 
        <div className="">
        {localStorage.getItem('type') === '1' ? <button onClick={this.onEditHandler.bind(this)}>EDIT</button> : null}
        <br/><br/>
        </div>  
      </div>
    )
  }
}

const mapStateToProps = state => { 
  return {
    userData: state.userData,
    articleEditState: state.articleEditState
    // articlesData: state.articlesData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentArticleEntry: setCurrentArticleEntry,
    setArticleEditState: setArticleEditState
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleEntry);