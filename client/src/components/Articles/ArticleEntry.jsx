import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentArticleEntry }from '../../actions/setCurrentArticleEntry';
import { setArticleEditState } from "../../actions/setArticleEditState";
import { setCurrentViewArticle } from '../../actions/setCurrentViewArticle';
import ArticleProfile from "./ArticleProfile";
import moment from 'moment';
import './articles.css';


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
      <div className="col-md-3">
        <div className="card mb-4 box-shadow small">
          <div className="card-image article-img">
            <img className="card-img-top photo-size" align="center" src={this.props.article.photo_url} />
          </div>
          <div className="">
            <h5 className="card-title article-card">{this.props.article.title}</h5>
            <p className="card-text article-card">{moment( this.props.article.date).format("MMMM Do YYYY")}</p>
            <p className="card-text article-card">{this.props.article.content.substring(0, 80) + `...`}</p>
          <div className="">
            <div className="d-flex justify-content-between align-items-center">
              <div className="row art">
                <div className="col-md-6">
                  <button type="button" className="btn-cits" onClick={this.onViewHandler.bind(this)}>View</button>
                </div>
                <div className="col-md-6">
                  {localStorage.getItem('type') === '1' ? <button type="button" className="btn-cits" onClick={this.onEditHandler.bind(this)}>Edit</button> 
                  : null}
                </div>
              </div>
            </div>
          </div>
          </div>
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


