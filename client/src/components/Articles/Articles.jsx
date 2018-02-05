import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setArticlesData } from '../../actions/setArticlesData';
import ArticleEntry from './ArticleEntry';
import axios from 'axios';

class Articles extends Component {
  constructor (props) {
    super(props)
  }

  async componentWillMount () {
    const articles = await axios.get('http://localhost:3396/api/articles/fetchAllArticles/1');
    articles ? this.props.setArticlesData(articles.data) : console.log('no articles');

  }

  render  () {

    return (
      <div>
        {this.props.articlesData ?
          <div>
            {this.props.articlesData.map( article => {
              return <div>{<ArticleEntry article={article}/>}</div>
              //pass in articleEntry
        })}
        </div> : <div>No available articles</div>}
      </div>
    )
  }
}

const mapStateToProps = state => { 
  return {
    userData: state.userData,
    articlesData: state.articlesData
  }
};

const matchDispatchToProps = dispatch => {
  console.log('dispatch,', dispatch)
  return bindActionCreators({
    setArticlesData: setArticlesData // get a post mosterajsdkfl
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Articles);