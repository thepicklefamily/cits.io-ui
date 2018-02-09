import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

import { setCurrentViewArticle } from '../../actions/setCurrentViewArticle';
import { setCurrentArticlePosts } from '../../actions/setCurrentArticlePosts';
import Post from '../Posts/Post';


class ArticleProfile extends Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    const { data } = await axios.get(`http://localhost:3396/api/posts/fetchPosts/${this.props.currentViewArticle.id}`);
    this.props.setCurrentArticlePosts(data);
  }

  async onCancelHandler () {
    this.props.setCurrentViewArticle('0');
    this.props.setCurrentArticlePosts([]);
  }


  render() {
    return (
      <div>
        ARTICLE PROFILE: 
        <br/>
        {/* still need to render article shit */}
        {JSON.stringify(this.props.currentArticlePosts)}
        { this.props.currentArticlePosts ? this.props.currentArticlePosts.map(post => {
          return (
          <div>
            <ul className="">
              <li>
                <ul>
                  <Post key={post.id} post={post} />
                </ul>
              </li>
            </ul>
            </div>
            );
        }) : null }
        <br/>
        <button onClick={this.onCancelHandler.bind(this)}>CANCEL</button> 
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentViewArticle: state.currentViewArticle,
    currentArticlePosts: state.currentArticlePosts
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentViewArticle: setCurrentViewArticle,
    setCurrentArticlePosts: setCurrentArticlePosts
  }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleProfile);