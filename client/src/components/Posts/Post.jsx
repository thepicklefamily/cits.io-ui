import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

class Post extends Component {
  constructor(props) {
    super(props);
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

  async onAddHandler () {
    const payload = {
      username: this.props.,
      test: ,
      date: ,
      article_id,
      parent_id
    }
    console.log('clicked');
    console.log(this.props.post)
  }
  
  async onUpdateHandler () {

  }

  async onDeleteHandler () {

  }

  render() {
    return (
      <div>
        <br/>
        {JSON.stringify(this.props.post)}
        <li>
          <div className="username">{ this.props.post.username }</div>
          <div className="text">{ this.props.post.text }</div>
          <div className="date">{ this.props.post.date }</div> 
          <ul>
          <button onClick={this.onAddHandler.bind(this)}>Reply</button>
          { this.props.post.children ?  this.props.post.children.map( child => {
            return ( 
              <div className="">
                <br/>
                  <Post key={child.id} post={child}/>
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
    
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    
  }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Post);

// const { children } = this.props

// return (
//   <div className="comments">
//     {children.map(comment =>
//       <div key={comment.id} className="comment">
//         <span>{comment.content}</span>
//         {comment.children && <Comments children={comment.children}/>}
//       </div>
//     )}
//   </div>
// )
