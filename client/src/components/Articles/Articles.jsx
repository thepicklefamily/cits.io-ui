import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setArticlesData } from "../../actions/setArticlesData";
import { setArticleEditState } from "../../actions/setArticleEditState";
import { setCurrentArticleEntry } from "../../actions/setCurrentArticleEntry";
import ArticleEntry from "./ArticleEntry";
import ArticleEntryForm from './ArticleEntryForm';
import axios from "axios";

class Articles extends Component {
  constructor(props) {
    super(props);
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount() {
    this.config.headers.authorization = await localStorage.getItem('token');
    this.props.setArticleEditState('0');
    const { data } = await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    await this.props.setArticlesData(data);

  }

  async onAddHandler() {
    await this.props.setCurrentArticleEntry({});
    await this.props.setArticleEditState('1');
  }

  async onCancelHandler() {
    await this.props.setArticleEditState('0');
  }

  render() {
    return (
      <div>
        ARTICLE DATA:
        <br />
        <br />
        {localStorage.getItem('type') === '1' ? (
          this.props.currentArticleEntry &&
          this.props.articleEditState !== '0' ? (
            <div>
            <ArticleEntryForm data={this.props.currentArticleEntry}  />
            <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button> 
            </div>
          ) : this.props.articlesData ? (
            this.props.articlesData.map(article => {
              return <ArticleEntry article={article} key={article.id} />;
            })
          ) : (
            'No DATA'
          )
        ) : this.props.articlesData ? (
          this.props.articlesData.map(article => {
            return <ArticleEntry article={article} key={article.id} />;
          })
        ) : (
          'No DATA'
        )}
        {this.props.articleEditState === '0' &&
        localStorage.getItem('type') === '1' ? (
          <button onClick={this.onAddHandler.bind(this)}>ADD NEW ENTRY</button>
        ) : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    articlesData: state.articlesData,
    currentArticleEntry: state.currentArticleEntry,
    articleEditState: state.articleEditState,
    currentProperty: state.currentProperty
  };
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setArticlesData: setArticlesData,
      setCurrentArticleEntry: setCurrentArticleEntry,
      setArticleEditState: setArticleEditState
    },
    dispatch
  );
};

export default connect(mapStateToProps, matchDispatchToProps)(Articles);
