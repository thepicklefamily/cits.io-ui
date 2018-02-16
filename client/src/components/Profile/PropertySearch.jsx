import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { setSearchResults } from '../../actions/setSearchResults';
import { setSecretErrorState } from '../../actions/setSecretErrorState';
import axios from 'axios';

class PropertySearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '',
      secret: '',
      userClass: ''
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

  componentWillMount() {
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;

    if (localStorage.getItem('type') === '1') {
      this.setState({ userClass: 'col-lg-6 col-md-6 col-sm-12 col-xs-12 info-box' });
    }

    if (localStorage.getItem('type') === '0') {
      this.setState({ userClass: 'col-lg-12 col-md-12 col-sm-12 col-xs-12 info-box' });
    }
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
      .get(`${this.REST_URL}/api/properties/fetch/name?name=${this.state.searchInput}`, this.config);
    
    !searchData.data.length ? 
    this.props.setSearchResults(["No Results"])
    :
    this.props.setSearchResults(searchData.data);

    document.getElementById('searchInputField').value = '';
  }

  render() {
    return (
      <div className="container">
      <div className="row">
        <div className={this.state.userClass}>
          <div>

          </div>
          <span className="description">
            Search Property:
          </span>
          <div>
            <input 
              id="searchInputField"
              name="searchInput" 
              placeholder="Enter Property Name Here"
              onChange={this.inputChangeHandler}
              onKeyUp={this.handleKeyPress}
              className="search"
            />
            <button className="profile-btn search" onClick={this.searchClickHandler}>Search</button>
          </div>
            {
              !this.props.searchResults.length ? null :
              this.props.userType === "0" ?
                <div><br/><hr/>
                  {
                    this.props.searchResults[0] === "No Results" ? 
                    <div>
                      <span className="info">
                        No results, please try again.
                      </span>
                    </div>
                    : 
                    this.props.searchResults.map(property => 
                      <div key={property.id}><br/>
                        <div className="description">
                          {property.name}
                        </div>
                        <div className="info">
                          {property.address}
                        </div>
                        {
                          this.props.propertyID === property.id ? 
                          <button className="selected-btn" onClick={() => { this.props.selectProperty(null)}}>Unselect Property</button>
                          :
                          <button className="select-btn" onClick={() => { this.props.selectProperty(property.id) }}>Select Property</button>
                        }
                        {
                          !this.props.propertyID ? null :
                          localStorage.getItem('type') === '1' ? null :
                          property.id !== this.props.propertyID ? null :
                          <div className="unit">
                            <div className="description">
                              Apartment Number/Unit:
                            </div>
                            <input 
                              name="apt_unit"
                              placeholder="Enter Unit Number"
                              onChange={this.props.inputChangeHandler}
                              className="unit-input"
                            />
                          </div>
                        }
                        <br/><br/><hr/>
                      </div>
                    )
                  }
                </div>
              :
              this.props.userType === "1" ?
                <div><br/><hr/>
                  {
                    this.props.searchResults[0] === "No Results" ? 
                    <span className="info">
                      No results, please try again.
                    </span>
                    : 
                    this.props.searchResults.map(property => 
                      <div key={property.id}><br/>
                        <div className="description">
                          {property.name}
                        </div>
                        <div className="info">
                          {property.address}
                        </div>
                        <div><br/>
                          {
                            this.props.propertyID === property.id ? null :
                            <span className="description">
                              Property Secret:
                            </span>
                          }
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
                          { this.props.secretErrorState ? <div>INVALID SECRET KEY</div> : null }
                        </div>
                        {
                          this.props.propertyID === property.id ? 
                          <button className="selected-btn" onClick={() => { this.props.selectProperty(null)}}>Unselect Property</button>
                          :
                          <button className="select-btn" onClick={() => { this.props.selectProperty(property.id, this.state.secret)}}>Select Property</button>
                        }
                        <br/><br/><hr/>
                      </div>
                    )
                  }
                </div>
              : null
            }
          </div>

          <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            {
              this.props.userType === "1" ?
                <div>
                  <h5>or Add New Property:</h5>
                  <form action="">
                    <div>
                      <span className="description">
                        Property Name:
                      </span>
                      <input 
                        onChange={this.props.inputChangeHandler}
                        name="propName" 
                        placeholder="Enter Property Name"
                        className="add-prop-input"
                      />
                    </div>

                    <div>
                      <span className="description">
                        Property Address:
                      </span>
                      <input 
                        onChange={this.props.inputChangeHandler}
                        name="propAddress" 
                        placeholder="Enter Property Address"
                        className="add-prop-input"
                      />
                    </div>

                    <div>
                      <span className="description">
                        Create Secret Key:
                      </span><br/>
                      <span className="side-note">
                        (This will allow you to invite others to manage the property)
                      </span>
                      <input 
                        type="password"
                        onChange={this.props.inputChangeHandler}
                        name="propSecret" 
                        placeholder="Enter Secret Key"
                        className="add-prop-input"
                      />
                    </div>
                  </form>
                </div>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchResults: state.searchResults,
    secretErrorState: state.secretErrorState
  }
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setSearchResults
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(PropertySearch);