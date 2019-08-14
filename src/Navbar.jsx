import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: auto 1fr auto;
  background-color: #7f5a83;
  background-image: linear-gradient(315deg, #7f5a83 0%, #0d324d 74%);
  z-index: 1;
  width: 100%;
  height: 10vh;
  color: white;
  box-shadow: 0px 2px 5px 0px #888888;
`;

const Logo = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 10px;
  font-weight: 600;
  align-self: center;
`;
const SearchBar = styled.input`
  margin: 6px;
  border-radius: 3px;
  border: none;
  width: 70%;
  height: 40%;
  justify-self: center;
  align-self: center;
  text-align: center;
  font-size: medium;
`;
const UserArea = styled.div`
  padding: 10px;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const UserActions = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  display: block;
  font-weight: 300;
`;

const Dropdown = styled.div`
  display: none;
  position: absolute;
  background-color: #13293d;
  text-decoration: none;
  top: 100%;
  transition: all 0.25s ease-in-out;

  ${UserActions}:hover {
    background-color: #596977;
    transition: all 0.25s ease-in-out;
  }
`;

const Username = styled.span`
  font-size: large;
  font-weight: 600;
  padding: 10px;
  height: 100%;
  align-items: center;
  display: flex;
  transition: all 0.25s ease-in-out;

  :hover > ${Dropdown} {
    display: block;
  }
`;

const LogoImage = styled.img`
  height: 55px;
`;

const Image = styled.img`
  height: 30px;
`;

const pulse = keyframes`
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(230, 0, 0, 0.6);
    box-shadow: 0 0 0 0 rgba(230, 0, 0, 0.6);
  }
  70% {
      -moz-box-shadow: 0 0 0 10px rgba(230, 0, 0, 0);
      box-shadow: 0 0 0 10px rgba(230, 0, 0, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(230, 0, 0, 0);
      box-shadow: 0 0 0 0 rgba(230, 0, 0, 0);
  }
}
`;

const ItemInCart = styled.div`
  background-color: #e60000;
  height: 17px;
  width: 17px;
  border-radius: 35px;
  position: absolute;
  top: 20px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: small;
  font-weight: 500;
  animation: ${pulse} 1s infinite;
`;

class Navbar extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    const response = await fetch('/session');
    const body = await response.json();
    if (body.success) {
      this.props.handleLogin(body.name);
    }
  }
  handleLogout = () => {
    fetch('/logout', {
      method: 'POST',
      credentials: 'include',
    });
    this.props.handleLogout();
  };
  render = () => {
    return (
      <>
        <Wrapper className='navbar'>
          <Logo to='/'>
            {/* <div id='logo'>Thrifty Movies</div> */}
            <LogoImage src='/imgs/logo.png' />
          </Logo>
          <SearchBar
            type='text'
            onChange={this.props.handleQueryChange}
            value={this.props.query}
            placeholder='Search a title'
          />
          {this.props.login ? (
            <UserArea id='user'>
              <Username>
                {this.props.name}
                <Dropdown>
                  <UserActions to='/additem' onClick={this.handleAddItem}>
                    Sell Item
                  </UserActions>
                  <UserActions to='/' onClick={this.handleLogout}>
                    Logout
                  </UserActions>
                </Dropdown>
              </Username>
              <UserActions to='/cart'>
                <Image src='/imgs/shopping-cart-solid_white.svg' />
                {this.props.cart.length === 0 ? (
                  ''
                ) : (
                  <ItemInCart>{this.props.cart.length}</ItemInCart>
                )}
              </UserActions>
            </UserArea>
          ) : (
            <UserArea id='user'>
              <UserActions to='/signup'>Sign up</UserActions>
              <UserActions to='/login'>Log in</UserActions>
            </UserArea>
          )}
        </Wrapper>
      </>
    );
  };
}

const mapStateToProps = state => ({
  query: state.Searchquery,
  login: state.loggedIn,
  username: state.username,
  name: state.name,
  cart: state.cart,
});

const mapDispatchToProps = dispatch => ({
  handleQueryChange: evt =>
    dispatch({ type: 'SET_QUERY', query: evt.target.value }),
  handleLogout: () =>
    dispatch({
      type: 'LOGOUT',
    }),
  handleLogin: name =>
    dispatch({
      type: 'LOGIN_SUCCESS',
      name: name,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
