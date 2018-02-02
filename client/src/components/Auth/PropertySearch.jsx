import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      searchInput: ''
    }

    this.searchChangeHandler = this.searchChangeHandler.bind(this);
    this.searchClickHandler = this.searchClickHandler.bind(this);
  }

  searchChangeHandler(e) {
    this.setState({
      searchInput: e.target.value
    });
  }

  searchClickHandler() {
    console.log(this.state.searchInput);
  }

  render() {
    return (
      <div>
        Search Property:
        {/* <form> */}
          <input 
            name="searchInput" 
            placeholder="Enter Property Name Here"
            onChange={this.searchChangeHandler}
          />
          <button onClick={this.searchClickHandler}>Search</button>
        {/* </form> */}
        {
          !this.state.results.length ? null :
          this.props.userType === 'tenant' ?
            <div>
              Tenant results
            </div>
          :
          this.props.userType === 'manager' ?
            <div>
              Manager results
            </div>
          : null
        }
        {
          this.props.userType === 'manager' ?
            <div>
              or Add New Property:
              <form action="">
                <div>
                  Property Name:
                  <input name="username" placeholder="Enter Username"/>
                </div>

                <div>
                  Property Address:
                  <input name="phone" placeholder="Phone Number"/>
                </div>

                <div>
                  Create Secret Key (This will allow you to invite others to manage the property):
                  <input name="password" placeholder="Enter Password"/>
                </div>
              </form>
            </div>
            : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userData
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(Signup));