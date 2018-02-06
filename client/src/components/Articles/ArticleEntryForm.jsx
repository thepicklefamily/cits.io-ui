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
  }

  componentDidMount() {
    document.getElementsByName('title')[0].value = this.props.data.title ? this.props.data.title : null;
    document.getElementsByName('date')[0].value = this.props.data.date ? this.props.data.date : null;
    document.getElementsByName('content')[0].value = this.props.data.content ? this.props.data.content : null;
    document.getElementsByName('photo')[0].value = this.props.data.photo ? this.props.data.photo : null;
  }

  async onAddHandler () {
    const payload = {
      property_id: this.props.currentProperty.id,
      user_id: this.props.userData.id, 
      title: document.getElementsByName('title')[0].value.toString(),
      content: document.getElementsByName('content')[0].value.toString(),
      date: document.getElementsByName('date')[0].value.toString(),
      photo_url: document.getElementsByName('photo')[0].value.toString()
    }
    const { data } = await axios.post(`http://localhost:3396/api/articles/addArticle`, payload);
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${this.props.currentProperty.id}`);
    this.props.setArticlesData(d.data);
    data ?  await this.props.setArticleEditState('0') : null;
  }
  
  async onUpdateHandler () {
    const payload = {
      article_id: this.props.data.id,
      title: document.getElementsByName('title')[0].value.toString(),
      content: document.getElementsByName('content')[0].value.toString(),
      date: document.getElementsByName('date')[0].value.toString(),
      photo_url: document.getElementsByName('photo')[0].value.toString()
    }
    const { data } = await axios.put(`http://localhost:3396/api/articles/editArticle`, payload);
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${this.props.currentProperty.id}`);
    this.props.setArticlesData(d.data);
    data ?  await this.props.setArticleEditState('0') : null;
  }
  
  async onDeleteHandler () {
    await axios.delete(`http://localhost:3396/api/articles/deleteArticle/${this.props.data.id}/${this.props.data.propertyid}`)
    const d =  await axios.get(`http://localhost:3396/api/articles/fetchAllArticles/${this.props.currentProperty.id}`);
    await this.props.setArticlesData(d.data);
    await this.props.setArticleEditState('0');
  }
  
  

  render () {
    console.log(this.props)
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
    userData: state.userData,
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