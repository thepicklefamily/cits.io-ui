import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { setCurrentViewArticle } from "../../actions/setCurrentViewArticle";
import { setCurrentArticlePosts } from "../../actions/setCurrentArticlePosts";
import Post from "../Posts/Post";
import "./articles.css";

class ArticleProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      date: "",
      data: [],
      children: ""
    };

    this.config = {
      headers: {
        authorization: ""
      }
    };
    this.passChild = this.passChild.bind(this);
  }

  async componentWillMount() {
    this.REST_URL =
      process.env.NODE_ENV === "production"
        ? process.env.REST_SERVER_AWS_HOST
        : process.env.REST_SERVER_LOCAL_HOST;

    this.config.headers.authorization = await localStorage.getItem("token");
    let data = null;
    try {
      data = this.props.currentViewArticle.id
        ? ({ data } = await axios.get(
            `${this.REST_URL}/api/posts/fetchPosts/${
              this.props.currentViewArticle.id
            }`,
            this.config
          ))
        : null;
    } catch (err) {
      console.log("italian fix");
    }
    let children;
    data
      ? await (this.props.setCurrentArticlePosts(data),
        (children = this.findChildren(data.data)),
        this.setState({ children }))
      : this.props.setCurrentViewArticle("0");
  }

  onChangeHandler(e) {
    e.preventDefault();

    this.setState({
      [e.target.name]: e.target.value
    });

    // e.target.reset();
  }

  async onAddHandler(e) {
    e.preventDefault();

    const payload = {
      username: localStorage.getItem("username"),
      text: this.state.comment,
      date: new Date(),
      article_id: this.props.currentViewArticle.id,
      parent_id: null
    };

    const { data } = await axios.post(
      `${this.REST_URL}/api/posts/addPost`,
      payload,
      this.config
    );
    const d = await axios.get(
      `${this.REST_URL}/api/posts/fetchPosts/${
        this.props.currentViewArticle.id
      }`,
      this.config
    );
    await this.props.setCurrentArticlePosts(d.data);
    document.getElementsByName("comment").forEach(field => {
      field.value = "";
    });
    const children = this.findChildren(d.data);
    this.setState({
      children: children
    });
  }

  async onCancelHandler() {
    this.props.setCurrentViewArticle("0");
    this.props.setCurrentArticlePosts([]);
    this.props.history.push('/articles')
  }

  findChildren(nodes) {
    var counter = 0;

    const recurse = node => {
      if (node) {
        counter++;
      }

      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          recurse(node.children[i]);
        }
      }
    };

    for (var i = 0; i < nodes.length; i++) {
      recurse(nodes[i]);
    }
    return counter;
  }

  passChild(nodes) {
    const a = this.findChildren(nodes);
    this.setState({
      children: a
    });
  }

  render() {
    return (
      <div>
        {this.props.currentViewArticle !== null ? (
          <h2 className="news-header" align="center">
            {this.props.currentViewArticle.title}
          </h2>
        ) : null}
        <br />
        <div className="row">
          <div className="col-md-6">
            {this.props.currentViewArticle !== null ? (
              <img
                className="article-profile-img"
                src={this.props.currentViewArticle.photo_url}
              />
            ) : null}
          </div>
          <div className="col-md-6">
            {this.props.currentViewArticle !== null ? (
              <div className="article-img">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {this.props.currentViewArticle.title}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {this.props.currentViewArticle !== null
                        ? moment(this.props.currentViewArticle.date).format(
                            "dddd, MMMM Do YYYY"
                          )
                        : null}
                    </h6>
                    <p className="card-text">
                      {this.props.currentViewArticle.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="row" />

        <div className="container">
          <div className="post-comments">
            <div className="col-md-12">
              <div className="page-header">
                <h1>
                  <small className="float-right">
                    {this.state.children ? this.state.children : null} comments
                  </small>{" "}
                  Comments{" "}
                </h1>
              </div>
              <div className="comments-list">
                <form
                  className="col-md-4"
                  onSubmit={this.onAddHandler.bind(this)}
                >
                  <div className="form-group">
                    <label htmlFor="comment">Your Comment</label>
                    <input
                      name="comment"
                      className="form-control"
                      rows="3"
                      onChange={this.onChangeHandler.bind(this)}
                    />
                  </div>
                  <button
                    onClick={this.onAddHandler.bind(this)}
                    className="btn btn-default"
                  >
                    Send
                  </button>
                </form>

                {this.props.currentArticlePosts &&
                this.props.currentArticlePosts.data
                  ? this.props.currentArticlePosts.data.map(post => {
                      return (
                        <div key={post.id}>
                          <Post post={post} child={this.passChild} />
                        </div>
                      );
                    })
                  : this.props.currentArticlePosts &&
                    this.props.currentArticlePosts.length > 0
                    ? this.props.currentArticlePosts.map(post => {
                        return (
                          <div key={post.id}>
                            <Post post={post} child={this.passChild} />
                          </div>
                        );
                      })
                    : console.log("italian zest")}
                <br />
                <button onClick={this.onCancelHandler.bind(this)}>
                  View all articles
                </button>
              </div>
            </div>
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
  };
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setCurrentViewArticle: setCurrentViewArticle,
      setCurrentArticlePosts: setCurrentArticlePosts
    },
    dispatch
  );
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleProfile);
