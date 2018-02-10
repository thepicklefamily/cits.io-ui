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
    }

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.cancelHandler = this. cancelHandler.bind(this);
    this.propertyUpdateHandler = this.propertyUpdateHandler.bind(this);
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

    await axios.put('http://localhost:3396/api/properties/editProperty', propertyBody);

    // updates secret key if current secret keys match
    if (this.state.password && this.state.secretKey && this.state.confirmKey) {
      const userData = await axios.get(`http://localhost:3396/api/users/fetch/${localStorage.getItem('id')}`);

      const secretBody = {
        id: this.props.property.id,
        password: this.state.password,
        actualPassword: userData.data[0].password,
        secret_key: this.state.secretKey
      }

      this.state.secretKey !== this.state.confirmKey ? alert('Secret was not updated, new secret key entries must match!') :
      await axios.put('http://localhost:3396/api/properties/editSecret', secretBody);
    }

    this.props.setPropertyData();
    this.setState({ edit: 0 });
  }

  async saveHandler() {
    // add unit to apt_unit table
    const newUnit = await axios.post('http://localhost:3396/api/aptUnits/create', {
      unit: this.state.unit
    });

    // update joint table with new unit id
    const newJoinBody = {
      userID: localStorage.getItem('id'),
      propertyID: this.props.property.id,
      unitID: newUnit.data.id
    }

    await axios.put('http://localhost:3396/api/usersPropertiesAptUnits/editUsersPropertiesAptUnits', newJoinBody);

    // query new propertyData for Profile
    this.props.setPropertyData();

    // set state.edit back to 0
    this.setState({ edit: 0 });
  }

  editHandler() {
    this.setState({ edit: 1 });
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
                </div><br/>

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
    userData: state.userData,
  }
};

export default (connect(mapStateToProps)(PropertyListItem));