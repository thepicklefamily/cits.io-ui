import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { setCurrentArticlePosts } from '../../actions/setCurrentArticlePosts';
import { setCurrentViewArticle } from '../../actions/setCurrentViewArticle';


class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reply: '',
      date: ''
    }
  }

  onChangeHandler (e) {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  async onAddHandler () {
    const payload = {
      username: localStorage.getItem('username'),
      text: this.state.reply,
      date: this.state.date,
      article_id: this.props.post.articleid,
      parent_id: this.props.post.id
    }

    const { data } = await axios.post(`http://localhost:3396/api/posts/addPost`, payload);
    const d = await axios.get(`http://localhost:3396/api/posts/fetchPosts/${this.props.post.articleid}`);
    this.props.setCurrentArticlePosts(d.data);

  }
  
  async onDeleteHandler () {
    await axios.delete(`http://localhost:3396/api/posts/deletePost/${this.props.post.id}`);
    const d = await axios.get(`http://localhost:3396/api/posts/fetchPosts/${this.props.post.articleid}`);
    await this.props.setCurrentArticlePosts(d.data);
  }
  
  // async onUpdateHandler () {

  // }
  render() {
    return (
      <div>
        <br/>
        {/* {JSON.stringify(this.props.post)} */}
        <li>
          <div className="username">{ this.props.post.username }</div>
          <div className="text">{ this.props.post.text }</div>
          <div className="date">{ this.props.post.date }</div> 
          { localStorage.getItem('type') === '1' ? (
            <button onClick={this.onDeleteHandler.bind(this)}>DELETE</button>
          ) : null}
          <br/><br/>
          reply: <input onChange={this.onChangeHandler.bind(this)} type='text' name='reply'></input>
          date: <input onChange={this.onChangeHandler.bind(this)} type='text' name='date'></input>
          <button onClick={this.onAddHandler.bind(this)}>Reply</button>

          <ul>
          { this.props.post.children ?  this.props.post.children.map( child => {
            return ( 
              <div className="">
                <br/>
                  <Post {...this.props} key={child.id} post={child}/>
              </div>
            )
          }) : null}
          
          </ul>
        </li>
        <br/>
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

export default connect(mapStateToProps, matchDispatchToProps)(Post);