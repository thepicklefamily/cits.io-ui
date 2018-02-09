import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

class Post extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <br/>
        {/* {JSON.stringify(this.props.post)} */}
        <li>
          <div className="username">{ this.props.post.username }</div>
          <div className="text">{ this.props.post.text }</div>
          <div className="date">{ this.props.post.date }</div> 
          <ul>
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

/**
<ul>
  <li>response1
  <ul>
    <li>response1a</li>
    <li>response1b
      <ul>
        <li>response1b1</li>
      </ul>
    </li>
  </ul>
</ul>
 */

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
