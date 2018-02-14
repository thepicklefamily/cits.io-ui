import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentArticleEntry }from '../../actions/setCurrentArticleEntry';
import { setArticleEditState } from "../../actions/setArticleEditState";
import { setArticlesData } from '../../actions/setArticlesData';
import axios from 'axios';

class ArticleEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleError: false
    }
    this.config = {
      headers: {
        authorization: ''
      }
    };
  }

  componentDidMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    document.getElementsByName('title')[0].value = this.props.data.title ? this.props.data.title : null;
    document.getElementsByName('date')[0].value = this.props.data.date ? this.props.data.date : null;
    document.getElementsByName('content')[0].value = this.props.data.content ? this.props.data.content : null;
    document.getElementsByName('photo')[0].value = this.props.data.photo_url ? this.props.data.photo_url : null;
  }

  async onAddHandler () {
    const payload = {
      property_id: localStorage.getItem('propertyId'),
      user_id: localStorage.getItem('id'), 
      title: document.getElementsByName('title')[0].value.toString(),
      content: document.getElementsByName('content')[0].value.toString(),
      date: document.getElementsByName('date')[0].value.toString(),
      photo_url: document.getElementsByName('photo')[0].value.toString()
    }
    let data = null;
    try {
      data = { data } = await axios.post(`http://localhost:3396/api/articles/addArticle`, payload, this.config);
      this.setState({ articleError: false });
      console.log(this.state.articleError);

    }
    catch (err) {
      console.log('you dun gooooofed');
      this.setState({ articleError: true });
      console.log(this.state.articleError);
    }
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    this.props.setArticlesData(d.data);
    data ?  await this.props.setArticleEditState('0') : console.log('no data foo');
  }
  
  async onUpdateHandler () {
    const payload = {
      article_id: this.props.data.id,
      title: document.getElementsByName('title')[0].value.toString(),
      content: document.getElementsByName('content')[0].value.toString(),
      date: document.getElementsByName('date')[0].value.toString(),
      photo_url: document.getElementsByName('photo')[0].value.toString()
    }
    let data = null;
    try {
      data = { data } = await axios.put(`http://localhost:3396/api/articles/editArticle`, payload, this.config);
    }
    catch (err) {
      this.setState({ articleError: true });
    }
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    this.props.setArticlesData(d.data);
    data ?  await this.props.setArticleEditState('0') : null;
  }
  
  async onDeleteHandler () {
    await axios.delete(`http://localhost:3396/api/articles/deleteArticle/${this.props.data.id}`, this.config)
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${localStorage.getItem('propertyId')}`, this.config);
    await this.props.setArticlesData(d.data);
    await this.props.setArticleEditState('0');
  }

  render () {
    return (
      <div>
      title: <input type='text' name='title'></input>
      <br/><br/>
      date: <input type='text' name='date'></input>
      <br/><br/>
      content: <input type='text' name='content'></input>
      <br/><br/>
      Photo: <input type='text' name='photo'></input>
      <br/><br/>
      {this.state.articleError ? <div className="articleError">Please check your input fields and try again!</div> : null}
      {this.props.articleEditState === '1' ? <button onClick={this.onAddHandler.bind(this)}>ADD</button> : null}
      {this.props.articleEditState === '2' ? <div>
        <button onClick={this.onUpdateHandler.bind(this)}>UPDATE</button>
        <button onClick={this.onDeleteHandler.bind(this)}>DELETE</button>
        </div> : null}
      <br/><br/>
    </div>
    )
  }

}
const mapStateToProps = state => { 
  return {
    articleEditState: state.articleEditState,
    currentProperty: state.currentProperty
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setCurrentArticleEntry: setCurrentArticleEntry,
    setArticleEditState: setArticleEditState,
    setArticlesData: setArticlesData
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(ArticleEntryForm);