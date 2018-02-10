import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      searchInput: '',
      secret: ''
    }

    this.config = {
      headers: {
        authorization: 'raw'
      }
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.searchClickHandler = this.searchClickHandler.bind(this);
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async searchClickHandler() {
    const searchResults = await axios
      .get(`http://localhost:3396/api/properties/fetch/name?name=${this.state.searchInput}`, this.config);
    
    !searchResults.data.length ? 
    this.setState({ 
      results: ["No Results"]
    })
    :
    this.setState({
      results: searchResults.data
    });

    document.getElementById('searchInputField').value = '';
  }

  render() {
    return (
      <div>
        Search Property:
        {/* <form> */}
          <input 
            id="searchInputField"
            name="searchInput" 
            placeholder="Enter Property Name Here"
            onChange={this.inputChangeHandler}
          />
          <button onClick={this.searchClickHandler}>Search</button>
        {/* </form> */}
        {
          !this.state.results.length ? null :
          this.props.userType === "0" ?
            <div>
              {
                this.state.results[0] === "No Results" ? 
                <div>
                  No results, please try again.
                </div>
                : 
                this.state.results.map(property => 
                  <div key={property.id}>
                    <div>
                      {property.name}
                    </div>
                    <div>
                      {property.address}
                    </div>
                    {
                      this.props.propertyID === property.id ? 
                      <button onClick={() => { this.props.selectProperty(null)}}>Unselect Property</button>
                      :
                      <button onClick={() => { this.props.selectProperty(property.id) }}>Select Property</button>
                    }
                  </div>
                )
              }
            </div>
          :
          this.props.userType === "1" ?
            <div>
              {
                this.state.results[0] === "No Results" ? 
                <div>
                  No results, please try again.
                </div>
                : 
                this.state.results.map(property => 
                  <div key={property.id}>
                    <div>
                      {property.name}
                    </div>
                    <div>
                      {property.address}
                    </div>
                    <div>
                      Property Secret:
                      {
                        this.props.propertyID === property.id ? null :
                        <input 
                          id="secretInputField"
                          type="password"
                          name="secret" 
                          placeholder="Enter Secret Key"
                          onChange={this.inputChangeHandler}
                        />
                      }
                    </div>
                    {
                      this.props.propertyID === property.id ? 
                      <button onClick={() => { this.props.selectProperty(null)}}>Unselect Property</button>
                      :
                      <button onClick={() => { this.props.selectProperty(property.id, this.state.secret)}}>Select Property</button>
                    }
                  </div>
                )
              }
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
                    type="password"
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
    //
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    //
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Signup);