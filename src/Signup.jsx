import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

const filmMakers = [
  'Martin Scorcese',
  'Quentin Tarantino',
  'Steven Spielberg',
  'David Fincher',
  'Denis Villeneuve',
  'Paul Thomas Anderson',
  'David Lynch',
  'Christopher Nolan',
  'Spike Jonze',
  'Francis Ford Coppola',
  'Stanley Kubrick',
  'Spike Lee',
  'Akira Kurosawa',
  'Alfonso Cuarón',
  'Richard Linklater',
  'Alfred Hitchcock',
  'Guillermo del Toro',
  'Steven Soderbergh',
  'Ingmar Bergman',
  'Danny Boyle',
  'Peter Jackson',
  'Hayao Miyazaki',
  'Sofia Coppola',
  'Kathryn Bigelow',
  'Agnes Varda',
  'Mira Nair',
  'Greta Gerwig',
  'Agnieszka Holland',
  'Nora Twomey',
  'Nancy Meyers',
  'Kimberly Peirce',
  'Catherine Hardwick',
  'Dee Rees',
  'Penny Marshall',
  'Sarah Polley',
  'Niki Caro',
  'Ava DuVernay',
  'Susan Seidelman',
  'Lynne Ramsay',
  'Marjane Satrapi',
  'Lana Wachowski',
  'Lilly Wachowski',
  'Jane Campion',
];

const SignUp = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SignUpWindow = styled.div`
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

const randomName = () => {
  return filmMakers[getRandomInt(0, filmMakers.length)];
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function firstNameLower(string) {
  return string.split(' ')[0].toLowerCase();
}

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      name: '',
      placeholderUserName: randomName(),
    };
  }
  handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };
  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };
  handleSubmit = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append('username', this.state.username);
    data.append('password', this.state.password);
    data.append('name', this.state.name);
    let response = await fetch('/signup', {
      method: 'POST',
      body: data,
    });
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    const username = this.state.username;
    console.log('Signup body', body);
    console.log('Signup userObject', body.userObject);
    console.log('Signup userObject[username]', body.userObject[username]);
    console.log('Signup username', username);
    if (!body.success) {
      return alert('Username already exists');
    }
    this.props.dispatch({
      type: 'SIGNUP_SUCCESS',
      username: username,
      payload: body.userObject[username],
    });
    this.props.dispatch({
      type: 'LOGIN_SUCCESS',
      name: this.state.name,
      username: username,
      payload: body.userObject[username],
    });
    this.props.history.push('/');
  };
  render = () => {
    return (
      <SignUp>
        <SignUpWindow>
          <h1>Sign up</h1>
          <Form onSubmit={this.handleSubmit}>
            Name
            <Input
              type='text'
              onChange={this.handleNameChange}
              placeholder={this.state.placeholderUserName}
            />
            Username
            <Input
              type='text'
              onChange={this.handleUsernameChange}
              placeholder={firstNameLower(this.state.placeholderUserName)}
            />
            Password
            <Input type='password' onChange={this.handlePasswordChange} />
            <Submit type='submit' value='Submit' />
          </Form>
        </SignUpWindow>
      </SignUp>
    );
  };
}

const mapStateToProps = state => {
  return {};
};

export default withRouter(connect(mapStateToProps)(Signup));
