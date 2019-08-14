import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const ItemArea = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemCard = styled.div`
  background-color: #1b98e0;
  min-width: 60%;
  max-width: 60%;
  max-height: 50%;
  display: flex;
  align-items: center;
  padding: 5%;
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.25);
  text-align: center;
  font-weight: 600;
  font-size: larger;
  color: white;
`;

const CoverImage = styled.img`
  height: 350px;
  width: 250px;
  object-fit: cover;
  margin: 3%;
`;

const InfoCard = styled.div`
  margin: 3%;
  min-height: 350px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: xx-large;
  margin-top: 0;
  margin-bottom: 2%;
`;

const Year = styled.div`
  font-weight: 300;
  font-size: medium;
  padding: 2%;
`;

const Description = styled.p`
  font-weight: 300;
`;

const FormatImage = styled.img`
  width: 65px;
`;

const Seller = styled(Link)`
  text-decoration: none;
  color: white;
  font-weight: 300;
  font-size: medium;
  padding: 2%;
  transition: all 0.25s ease-in-out;

  :hover {
    border: solid 1px;
    border-color: #1c6f9e;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const Price = styled.div`
  padding: 5%;
  font-size: larger;
`;

const buttonStyles = css`
  padding: 5px;
  width: 100%;
  border: solid 1px;
  border-color: #fcfdff;
  background-color: #fcfdff;
  color: black;
  font-weight: bolder;
  font-size: medium;
  border-radius: 3px;
  transition: all 0.25s ease-in-out;

  :hover {
    border: solid 1px;
    border-color: #fcfdff;
    border-radius: 3px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const LoginLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const AddToCart = styled.button`
  ${buttonStyles}
`;

const Login = styled.button`
  ${buttonStyles}
`;

const ItemInCart = styled.button`
  ${buttonStyles};
  color: black;
  background-color: #6cb7e2;
  border-color: #6cb7e2;

  :hover {
    border-color: #6cb7e2;
  }
`;

function formatImage(format) {
  if (format === 'VHS') {
    return '/imgs/VHS_logo_white.svg';
  }
  if (format === 'DVD') {
    return '/imgs/DVD_logo_white.svg';
  }
  if (format === 'Blu Ray') {
    return '/imgs/BD_logo_white.svg';
  }
}

class ItemDetails extends Component {
  handleAddToCart = () => {
    console.log('ItemDetails cart before dispatch', this.props.cart);
    console.log('ItemDetails click on product', this.props.item);
    this.props.dispatch({
      type: 'ADD_TO_CART',
      payload: this.props.item,
    });
    console.log('ItemDetails cart after dispatch', this.props.cart);
  };
  render() {
    console.log('ItemDetails users', this.props.users);
    return (
      <ItemArea id='itemArea'>
        <ItemCard className='itemCard'>
          <CoverImage src={this.props.item.image} />
          <InfoCard>
            <Title>{this.props.item.name}</Title>
            <Year>{Number(this.props.item.year)}</Year>
            <FormatImage src={formatImage(this.props.item.format)} />
            <Description>{this.props.item.description}</Description>
            <Seller to={'/seller/' + this.props.item.sellerId}>
              Sold by {this.props.item.seller}
            </Seller>
            <Price>
              {Number(this.props.item.price) === 0
                ? 'Free!'
                : Number(this.props.item.price).toLocaleString('en-CA', {
                    style: 'currency',
                    currency: 'CAD',
                  })}
            </Price>
            {this.props.login ? (
              this.props.cart
                .map(item => item.id)
                .includes(this.props.item.id) ? (
                <ItemInCart>Item in cart</ItemInCart>
              ) : (
                <AddToCart onClick={this.handleAddToCart}>
                  Add to cart
                </AddToCart>
              )
            ) : (
              <Login>
                <LoginLink to='/login'>Log in to buy</LoginLink>
              </Login>
            )}
          </InfoCard>
        </ItemCard>
      </ItemArea>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.loggedIn,
    items: state.items,
    users: state.users,
    cart: state.cart,
  };
};

export default connect(mapStateToProps)(ItemDetails);
