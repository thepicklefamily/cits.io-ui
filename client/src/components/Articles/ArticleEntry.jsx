import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentArticleEntry }from '../../actions/setCurrentArticleEntry';
import { setArticleEditState } from "../../actions/setArticleEditState";
import { setCurrentViewArticle } from '../../actions/setCurrentViewArticle';
import ArticleProfile from "./ArticleProfile";
import axios from 'axios';


class ArticleEntry extends Component {
  constructor(props) {
    super(props);
  }

  async onEditHandler() {
    await this.props.setCurrentArticleEntry(this.props.article);
    await this.props.setArticleEditState('2'); // on submit edit form, revert to false
  }

  async onViewHandler() {
    await this.props.setCurrentViewArticle(this.props.article);
  }

  render () {
    return (
      <div>
        Article Entry: <br/>
          {JSON.stringify(this.props.article)}
            {/* <div className="">
            <p className="">{this.props.article.title}</p>
            <p className="">{this.props.article.date}</p> 
            </div> */}
        <img src={this.props.article.photo_url}/>
        <br/><br/>
        <button onClick={this.onViewHandler.bind(this)}>More Info</button> 
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
    articleEditState: state.articleEditState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentArticleEntry: setCurrentArticleEntry,
    setArticleEditState: setArticleEditState,
    setCurrentViewArticle, setCurrentViewArticle,
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleEntry);