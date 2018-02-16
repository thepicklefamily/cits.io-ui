import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';
import moment from 'moment'

import { setCurrentArticlePosts } from '../../actions/setCurrentArticlePosts';
import { setCurrentViewArticle } from '../../actions/setCurrentViewArticle';


class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reply: '',
      show: false,
      replyClicked: false,
    }

    this.config = {
      headers: {
        authorization: ''
      }
    };
  }
  
  async componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
    this.config.headers.authorization = localStorage.getItem('token');
  }

  onChangeHandler (e) {
    e.preventDefault();

    this.setState({
      [e.target.name] : e.target.value
    })
  }

  onClickHander () {
    this.setState({
      replyClicked: !this.state.replyClicked
    })
  }
  
  onShow () {
    this.setState({
      show: !this.state.show
    })
  }

  async onAddHandler (e) {
    e.preventDefault();

    const payload = {
      username: localStorage.getItem('username'),
      text: this.state.reply,
      date: new Date(),
      article_id: this.props.post.articleid,
      parent_id: this.props.post.id
    }

    const { data } = await axios.post(`${this.REST_URL}/api/posts/addPost`, payload, this.config);
    const d = await axios.get(`${this.REST_URL}/api/posts/fetchPosts/${this.props.post.articleid}`, this.config);
    await this.props.setCurrentArticlePosts(d.data);
    document.getElementsByName('reply').forEach( field => {
      field.value = '';
    });

    await this.props.child(this.props.currentArticlePosts);
    
  }
  
  
  async onDeleteHandler () {
    await axios.delete(`${this.REST_URL}/api/posts/deletePost/${this.props.post.id}`, this.config);
    const d = await axios.get(`${this.REST_URL}/api/posts/fetchPosts/${this.props.post.articleid}`, this.config);
    await this.props.setCurrentArticlePosts(d.data);

    await this.props.child(d.data);
  }

  render() {
    return (
      <div>
        <div className="media post-comments-posts">
            {/* <a className="media-left" href="#">
              <img src="http://lorempixel.com/40/40/people/2/"/>
            </a> */}
            <div className="media-body col-md-12">
              <h6 className="media-heading user_name">{this.props.post.username}</h6>
              {this.props.post.text}
              <p className="pull-right"><small>{moment(this.props.post.date).fromNow()}</small></p>
              <div className="row">
              { localStorage.getItem('type') === '1' ? (
                <button onClick={this.onDeleteHandler.bind(this)} className="col-md-1 btn-cits">delete</button>
              ) : null}
                <button onClick={this.onShow.bind(this)} className="col-md-1 btn-cits">view</button>
                <button onClick={this.onClickHander.bind(this)} className="col-md-1 btn-cits">reply</button>
              </div>
                { this.state.replyClicked ? (
                  <div className="reply-form">
                    <form onSubmit={this.onAddHandler.bind(this)}>
                      <div className="">
                        <label htmlFor="reply" className="col-sm-2 col-form-label"></label>
                          <div className="col-sm-10">
                            <input type="text" onChange={this.onChangeHandler.bind(this)} className="form-control" name="reply" placeholder="Write a reply!"/>
                            <button className="btn-cits" onClick={this.onAddHandler.bind(this)}>Reply</button>
                          </div>
                      </div>
                    </form>
                  </div>
                ) : null}

              {/* </div> */}
              { this.state.show ? (
                  this.props.post.children ? ( this.props.post.children.map( child => {
                    return ( 
                      <div key={child.id}>
                          <Post {...this.props} post={child} child={this.props.child}/>
                      </div>
                    );
                  })
                  ) : null
                ) :
                  null
                  }
        </div>
      </div>
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
