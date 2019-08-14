import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Card = styled.div`
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
  color: white;
`;

const Button = styled(Link)`
  text-decoration: none;
  color: white;
  font-weight: 300;
  font-size: medium;
  padding: 2%;
  width: 50%;
  transition: all 0.25s ease-in-out;

  :hover {
    border: solid 1px;
    border-color: #1c6f9e;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

class Login extends Component {
  render = () => {
    return (
      <Wrapper>
        <Card>
          <h1>Thanks for shopping at Thrifty Movies!</h1>
          <Button to='/'>Back to homepage</Button>
        </Card>
      </Wrapper>
    );
  };
}

const mapStateToProps = state => {
  return {
    users: state.users,
  };
};

export default withRouter(connect(mapStateToProps)(Login));
