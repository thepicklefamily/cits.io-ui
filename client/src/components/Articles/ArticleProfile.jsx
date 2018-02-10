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
    this.config.headers.authorization = await localStorage.getItem('token');
    const { data } = await axios.get(`http://localhost:3396/api/posts/fetchPosts/${this.props.currentViewArticle.id}`, this.config);
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

    console.log(payload)

    const { data } = await axios.post(`http://localhost:3396/api/posts/addPost`, payload, this.config);
    const d = await axios.get(`http://localhost:3396/api/posts/fetchPosts/${this.props.currentViewArticle.id}`, this.config);
    this.props.setCurrentArticlePosts(d.data);
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
    console.log('article profile', this.props);
    return (
      <div>
        ARTICLE PROFILE: 
        <br/>
        {/* still need to render article shit */}
        {JSON.stringify(this.props.currentArticlePosts)}
        { this.props.currentArticlePosts ? this.props.currentArticlePosts.map(post => {
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
        }) : null}
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