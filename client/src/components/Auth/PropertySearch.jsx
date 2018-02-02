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
          this.props.userType === "0" ?
            <div>
              Tenant results
            </div>
          :
          this.props.userType === "1" ?
            <div>
              Manager results
            </div>
          : null
        }
        {
          this.props.userType === "1" ?
            <div>
              or Add New Property:
              <form action="">
                <div>
                  Property Name:
                  <input 
                  onChange={this.props.inputChangeHandler}
                  name="propName" 
                  placeholder="Enter Property Name"
                  />
                </div>

                <div>
                  Property Address:
                  <input 
                  onChange={this.props.inputChangeHandler}
                  name="propAddress" 
                  placeholder="Enter Property Address"
                  />
                </div>

                <div>
                  Create Secret Key (This will allow you to invite others to manage the property):
                  <input 
                  onChange={this.props.inputChangeHandler}
                  name="propSecret" 
                  placeholder="Enter Secret Key"
                  />
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