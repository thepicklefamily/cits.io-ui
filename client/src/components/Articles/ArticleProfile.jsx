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

    this.state = {
      reply: '',
      date: ''
    }

    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;

    this.config.headers.authorization = await localStorage.getItem('token');
    let data = null;
    try {
      data = this.props.currentViewArticle.id ? { data } = await axios.get(`${this.REST_URL}/api/posts/fetchPosts/${this.props.currentViewArticle.id}`, this.config) : null;
    }
    catch (err) {
      console.log('italian fix');
    }
    data ? await this.props.setCurrentArticlePosts(data) : this.props.setCurrentViewArticle('0');
  }

  onChangeHandler (e) {
    e.preventDefault();

    this.setState({
      [e.target.name] : e.target.value
    })

    // e.target.reset();
  }

  async onAddHandler () {
    const payload = {
      username: localStorage.getItem('username'),
      text: this.state.reply,
      date: this.state.date,
      article_id: this.props.currentViewArticle.id,
      parent_id: null
    }

    const { data } = await axios.post(`${this.REST_URL}/api/posts/addPost`, payload, this.config);
    const d = await axios.get(`${this.REST_URL}/api/posts/fetchPosts/${this.props.currentViewArticle.id}`, this.config);
    await this.props.setCurrentArticlePosts(d.data);
    document.getElementsByName('reply').forEach( field => {
      field.value = '';
    });
    document.getElementsByName('date').forEach( field => {
      field.value = '';
    });
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
        {JSON.stringify(this.props.currentViewArticle)}
        {this.props.currentArticlePosts && this.props.currentArticlePosts.data ? JSON.stringify(this.props.currentArticlePosts.data) : null}
        {this.props.currentArticlePosts && this.props.currentArticlePosts.data ? (this.props.currentArticlePosts.data.map(post => {
          return (
          <div key={post.id}> 
            <ul className="">
              <li>
                <ul>
                  <Post post={post} />
                </ul>
              </li>
            </ul>
            </div>
            );
        })) : this.props.currentArticlePosts && this.props.currentArticlePosts.length > 0 ? (this.props.currentArticlePosts.map(post => {
          return (
          <div key={post.id}> 
            <ul className="">
              <li>
                <ul>
                  <Post post={post} />
                </ul>
              </li>
            </ul>
            </div>
            );
        })) : console.log('italian zest') }
        <br/>
        reply: <input onChange={this.onChangeHandler.bind(this)} type='text' name='reply'></input>
        date: <input onChange={this.onChangeHandler.bind(this)} type='text' name='date'></input>
        <button onClick={this.onAddHandler.bind(this)}>Add a Comment</button>
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