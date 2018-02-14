import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router';
import axios from 'axios';

class PropertyListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: 0,
      unit: '',
      propName: this.props.property.name,
      propAddress: this.props.property.address,
      password: '',
      secretKey: '',
      confirmKey: ''
    };

    this.config = {
      headers: {
        authorization: ''
      }
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.cancelHandler = this. cancelHandler.bind(this);
    this.propertyUpdateHandler = this.propertyUpdateHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.deletePropertyHandler = this.deletePropertyHandler.bind(this);
  }

  componentWillMount() {
    this.config.headers.authorization = localStorage.getItem('token');
    this.REST_URL = (process.env.NODE_ENV === 'production') ? process.env.REST_SERVER_AWS_HOST : process.env.REST_SERVER_LOCAL_HOST;
  }

  inputChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async propertyUpdateHandler() {
    // updates property name and address
    const propertyBody = {
      id: this.props.property.id,
      name: this.state.propName,
      address: this.state.propAddress
    }

    await axios.put(`${this.REST_URL}/api/properties/editProperty`, propertyBody, this.config);

    // updates secret key if current secret keys match
    if (this.state.password && this.state.secretKey && this.state.confirmKey) {
      const userData = await axios.get(`${REST_URL}/api/users/fetch/${localStorage.getItem('id')}`, this.config);

      const secretBody = {
        id: this.props.property.id,
        password: this.state.password,
        actualPassword: userData.data[0].password,
        secret_key: this.state.secretKey
      }

      this.state.secretKey !== this.state.confirmKey ? alert('Secret was not updated, new secret key entries must match!') :
      await axios.put(`${this.REST_URL}/api/properties/editSecret`, secretBody, this.config);
    }

    this.props.setPropertyData();
    this.setState({ edit: 0 });
  }

  async saveHandler() {
    // add unit to apt_unit table
    const newUnit = await axios.post(`${this.REST_URL}/api/aptUnits/create`, {
      unit: this.state.unit
    }, this.config);

    // update joint table with new unit id
    const newJoinBody = {
      userID: localStorage.getItem('id'),
      propertyID: this.props.property.id,
      unitID: newUnit.data.id
    }

    await axios.put(`${this.REST_URL}/api/usersPropertiesAptUnits/editUsersPropertiesAptUnits`, newJoinBody, this.config);

    // query new propertyData for Profile
    this.props.setPropertyData();

    // set state.edit back to 0
    this.setState({ edit: 0 });
  }

  editHandler() {
    this.setState({ edit: 1 });
  }

  async removeHandler() {
    // delete associate between user and property
    const userID = localStorage.getItem('id');
    const propID = this.props.property.id;

    await axios
      .delete(`${this.REST_URL}/api/usersPropertiesAptUnits/deleteUsersPropertiesAptUnits?userID=${userID}&propertyID=${propID}`, this.config);

    this.props.setPropertyData();
  }

  async deletePropertyHandler() {
    const propID = this.props.property.id;

    // delete all joint table rows that have the property id
    await axios
      .delete(`${this.REST_URL}/api/usersPropertiesAptUnits/deleteByPropertyId?propertyID=${propID}`, this.config);

    // delete property from db
    await axios
      .delete(`${this.REST_URL}/api/properties/deleteProperty?propertyID=${propID}`, this.config);

    // reset the data
    this.props.setPropertyData();
  }

  cancelHandler() {
    this.setState({ edit: 0 });
  }

  render() {
    return (
      <li>
        {
          localStorage.getItem('type') === '0' ?
          <div>
            <div>
              {this.props.property.name}
            </div>
            <div>
              {this.props.property.address}
            </div>
            {
              this.state.edit === 0 ? 
              <div>
                <div>
                  Unit#: {this.props.property.unit}
                </div>
                <button onClick={this.editHandler}>Edit</button>
                <button onClick={this.removeHandler}>Remove</button>
              </div>
              :
              <div>
                <input 
                  type="text"
                  name="unit"
                  defaultValue={this.props.property.unit}
                  onChange={this.inputChangeHandler}
                />
                <button onClick={this.saveHandler}>SAVE</button>
                <button onClick={this.cancelHandler}>CANCEL</button>
              </div>
            }
          </div>
          :
          <div>
            {
              this.state.edit === 0 ?
              <div>
                <div>
                  {this.props.property.name}
                </div>
                <div>
                  {this.props.property.address}
                </div>
                <button onClick={this.editHandler}>Edit</button>
                <button onClick={this.removeHandler}>Remove From Account</button>
                <button onClick={this.deletePropertyHandler}>Delete Property</button>
              </div>
              :
              <div>
                NAME:
                <div>
                  <input 
                    type="text"
                    name="propName"
                    defaultValue={this.props.property.name}
                    onChange={this.inputChangeHandler}
                  />
                </div><br/>

                ADDRESS:
                <div>
                  <input 
                    type="text"
                    name="propAddress"
                    defaultValue={this.props.property.address}
                    onChange={this.inputChangeHandler}
                  />
                </div><br/>

                SECRET KEY:
                <div>
                  <div>
                    Your password:
                    <div>
                      <input 
                        type="text"
                        name="password"
                        placeholder="Enter your password"
                        onChange={this.inputChangeHandler}
                      />
                    </div>
                  </div><br/>

                  <div>
                    New secret key:
                    <div>
                      <input 
                        type="text"
                        name="secretKey"
                        placeholder="Enter new secret key"
                        onChange={this.inputChangeHandler}
                      />
                    </div>
                  </div><br/>

                  <div>
                    Confirm new secret key:
                    <div>
                      <input 
                        type="text"
                        name="confirmKey"
                        placeholder="Confirm secret key"
                        onChange={this.inputChangeHandler}
                      />
                    </div>
                  </div>
                </div><br/><br/>


                <button onClick={this.propertyUpdateHandler}>SAVE CHANGES</button>
                <button onClick={this.cancelHandler}>CANCEL</button>
              </div>
            }
          </div>
        }
      </li>
    )
  }
}

const mapStateToProps = state => {
  return {
    //
  }
};

export default (connect(mapStateToProps)(PropertyListItem));