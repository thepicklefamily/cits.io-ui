import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import axios from 'axios';

import './Core.css';

class LoggedIn extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      articles: []
    }

    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  async componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;

    const allArticles = await axios.get(`${this.REST_URL}/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    console.log('articles babey', allArticles.data);

    await this.setState({
      articles: allArticles.data
    });
  }

  render() {
    return (
      <div className="row" id="news">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 title">
          <h4>NEWS</h4>
        </div>

        {
          !this.state.articles.length ? null :
          <div>
            <div className="row">
              <img 
                className="col-lg-8 col-md-12 col-sm-12 col-xs-12 main-image"
                src={this.state.articles[0].photo_url} 
              />

              <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                <h3>{this.state.articles[0].title}</h3>
                <p className="date">{this.state.articles[0].date}</p>
                <p className="content">{this.state.articles[0].content}</p>
                <button 
                  className="see-through"
                >
                  Read More
                </button>
              </div>
            </div>

            <div className="small-articles row">
              {
                this.state.articles.slice(1).map(article => 
                  <div className="col-lg-3 col-md-6 col-sm-12 col-xs-12">
                    <img 
                      className="col-lg-12 col-md-12 col-sm-12 col-xs-12 sub-image"
                      src={article.photo_url}
                    />

                    <h6 className="small-title">{article.title}</h6>
                    <p className="date">{article.date}</p>
                    <p className="content">{article.content}</p>
                  </div>
                )
              }
            </div>

            <center>
              <button 
                onClick={() => {this.props.history.push('/articles')}}
                className="see-through view-all"
              >
                See All Articles
              </button>
            </center>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(LoggedIn);