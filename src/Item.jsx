import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const Card = styled.div`
  background-color: #fcfdff;
  margin: 2%;
  padding: 2%;
  color: black;
  text-align: center;
  border: solid 1px;
  border-radius: 3px;
  border-color: #dbe1de;
  transition: all 0.25s ease-in-out;
  text-decoration: none;
  width: 180px;

  :hover {
    border: solid 1px;
    border-color: #fcfdff;
    box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.25);
  }
`;

const CoverImage = styled.img`
  height: 200px;
  width: 150px;
  object-fit: cover;
`;

const InternalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  margin-top: 10%;
  margin-bottom: 10%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const FormatImage = styled.img`
  width: 65px;
`;

const Price = styled.div`
  font-weight: 600;
  font-size: large;
  margin: 5%;
`;

const SecondaryButtonStyles = css`
  text-decoration: none;
  color: black;
  padding: 2%;
  font-size: small;
  width: 100%;
  border-radius: 3px;
  transition: all 0.25s ease-in-out;

  :hover {
    background-color: #8e9aaf;
    color: white;
    font-weight: 600;
  }
`;

const Seller = styled(Link)`
  ${SecondaryButtonStyles}
`;

const Details = styled(Link)`
  ${SecondaryButtonStyles}
`;

const buttonStyles = css`
  padding: 2%;
  width: 100%;
  border: solid 1px;
  border-color: #1b98e0;
  background-color: #1b98e0;
  color: white;
  font-weight: bolder;
  font-size: medium;
  text-decoration: none;
  border-radius: 3px;
  transition: all 0.25s ease-in-out;

  :hover {
    border: solid 1px;
    border-color: #1c6f9e;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const AddToCart = styled(Link)`
  ${buttonStyles}
`;

const Login = styled(Link)`
  ${buttonStyles}
`;

const ItemInCart = styled(Link)`
  ${buttonStyles};
  color: black;
  background-color: #6cb7e2;
  border-color: #6cb7e2;
`;

function formatImage(format) {
  if (format === 'VHS') {
    return '/imgs/VHS_logo_black.svg';
  }
  if (format === 'DVD') {
    return '/imgs/DVD_logo_black.svg';
  }
  if (format === 'Blu Ray') {
    return '/imgs/BD_logo_black.svg';
  }
}

class Item extends Component {
  handleAddToCart = async evt => {
    evt.preventDefault();
    const item = {
      name: this.props.name,
      format: this.props.format,
      price: this.props.price,
      image: this.props.image,
      id: this.props.id,
      sellerId: this.props.sellerId,
      seller: this.props.seller,
    };
    console.log('Item click on product', item);
    const data = JSON.stringify(item);
    let response = await fetch('/addtocart', {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    const responseJson = await response.json();
    const itemToAdd = responseJson.item;
    const username = responseJson.username;
    console.log('Item itemToAdd', itemToAdd);
    this.props.dispatch({
      type: 'ADD_TO_CART',
      payload: item,
      username: username,
    });
  };
  render() {
    return (
      <Card className='card'>
        <Link to={'/details/' + this.props.id}>
          <CoverImage src={this.props.image} />
        </Link>
        <InternalWrapper id='item'>
          <Title>{this.props.name}</Title>
          <FormatImage src={formatImage(this.props.format)} />
          <Price>
            {Number(this.props.price) === 0
              ? 'Free!'
              : Number(this.props.price).toLocaleString('en-CA', {
                  style: 'currency',
                  currency: 'CAD',
                })}
          </Price>
          <Seller to={'/seller/' + this.props.sellerId}>
            Sold by {this.props.seller}
          </Seller>
          <Details to={'/details/' + this.props.id}>Item details</Details>
          {this.props.login ? (
            this.props.cart.map(item => item.id).includes(this.props.id) ? (
              <ItemInCart to='#'>Item in cart</ItemInCart>
            ) : (
              <AddToCart to='#' onClick={this.handleAddToCart}>
                Add to cart
              </AddToCart>
            )
          ) : (
            <Login to='/login'>Log in to buy</Login>
          )}
        </InternalWrapper>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.loggedIn,
    cart: state.cart,
    username: state.username,
  };
};

export default connect(mapStateToProps)(Item);
