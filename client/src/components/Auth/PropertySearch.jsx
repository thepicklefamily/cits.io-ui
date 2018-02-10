import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { setSearchResults } from '../../actions/setSearchResults';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    (e.keyCode === 13) ? this.searchClickHandler() : null;
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async searchClickHandler() {
    const searchData = await axios
      .get(`http://localhost:3396/api/properties/fetch/name?name=${this.state.searchInput}`, this.config);
    
    !searchData.data.length ? 
    this.props.setSearchResults(["No Results"])
    :
    this.props.setSearchResults(searchData.data);

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
            onKeyUp={this.handleKeyPress}
          />
          <button onClick={this.searchClickHandler}>Search</button>
        {/* </form> */}
        {
          !this.props.searchResults.length ? null :
          this.props.userType === "0" ?
            <div>
              {
                this.props.searchResults[0] === "No Results" ? 
                <div>
                  No results, please try again.
                </div>
                : 
                this.props.searchResults.map(property => 
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
                this.props.searchResults[0] === "No Results" ? 
                <div>
                  No results, please try again.
                </div>
                : 
                this.props.searchResults.map(property => 
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
            <div><br/>
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
    searchResults: state.searchResults
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setSearchResults
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Signup);