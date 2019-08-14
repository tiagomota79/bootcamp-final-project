import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const LogIn = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LoginWindow = styled.div`
  background-color: #1b98e0;
  min-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5%;
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.25);
  text-align: center;
  font-weight: 600;
  font-size: larger;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: none;
  padding: 1%;
  margin: 2%;
  text-align: center;
`;
const Submit = styled.input`
  margin: 2%;
  width: 30%;
  border: none;
  border-radius: 3px;
  height: 30px;
  font-size: large;

  :hover {
    border: solid 1px;
    border-color: #fcfdff;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const NoUser = styled(Link)`
  font-size: medium;
  font-weight: 300;
  text-decoration: none;
  color: black;
  padding-top: 3%;
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append('username', this.state.username);
    data.append('password', this.state.password);
    let response = await fetch('/login', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    let responseBody = await response.text();
    console.log('Login responseBody', responseBody);
    let body = JSON.parse(responseBody);
    console.log('Login parsed body', body);
    console.log('Login state', this.state);
    if (!body.success) {
      alert('login failed');
      return;
    }
    this.props.dispatch({
      type: 'LOGIN_SUCCESS',
      name: body.name,
      username: body.username,
    });
    this.props.history.push('/');
  };
  render = () => {
    return (
      <LogIn>
        <LoginWindow>
          <h1>Login</h1>
          <Form onSubmit={this.handleSubmit}>
            Username
            <Input type='text' onChange={this.handleUsernameChange} />
            Password
            <Input type='password' onChange={this.handlePasswordChange} />
            <Submit type='submit' value='Submit' />
          </Form>
          <NoUser to='/signup'>Not registered? Sign up!</NoUser>
        </LoginWindow>
      </LogIn>
    );
  };
}

const mapStateToProps = state => {
  return {
    users: state.users,
  };
};

export default withRouter(connect(mapStateToProps)(Login));
