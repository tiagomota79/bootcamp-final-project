import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background-color: #1b98e0;
  min-width: 60%;
  max-width: 60%;
  max-height: 50%;
  padding: 5%;
  box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.25);
  text-align: center;
  font-weight: 600;
  font-size: larger;
  color: white;
`;

const Table = styled.table`
  width: 100%;
`;

const THead = styled.thead`
  text-align: right;
`;

const TBody = styled.tbody`
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TFoot = styled.tfoot`
  text-align: right;
`;

const Th = styled.th`
  font-weight: 300;
  font-size: smaller;
`;

const Title = styled.td`
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const Image = styled.img`
  height: 50px;
  width: 40px;
  object-fit: cover;
`;

const FormatImage = styled.img`
  width: 40px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 5%;
`;

const Button = styled.button`
  padding: 8%;
  border: none;
  border-radius: 3px;
  font-weight: 600;
  font-size: small;

  :hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const CheckoutButton = styled.button`
  padding: 2%;
  width: 45%;
  border: none;
  border-radius: 3px;

  :hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  }
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: medium;
  font-weight: 600;
`;

const EmptyCart = styled.div`
  font-size: xx-large;
  padding: 5%;
`;

const ButtonSmallText = styled.div`
  font-size: x-small;
  font-weight: 300;
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

class Cart extends Component {
  handleRemoveFromCart = idx => {
    this.props.dispatch({
      type: 'REMOVE_FROM_CART',
      payload: idx,
    });
  };
  handleCheckout = async evt => {
    evt.preventDefault();
    const cart = this.props.cart;
    const data = JSON.stringify(cart);
    let response = await fetch('/checkout', {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    });
    const responseJson = await response.json();
    const itemsToDelete = responseJson.cart;
    this.props.dispatch({
      type: 'CHECKOUT',
      payload: itemsToDelete,
    });
    this.props.history.push('/checkout');
  };
  render() {
    console.log('Cart item', this.props.cart);
    return (
      <Wrapper>
        {this.props.cart.length === 0 ? (
          <Card>
            <EmptyCart>Your cart is empty!</EmptyCart>
            <CheckoutButton>
              <ButtonLink to='/'>Go back to shopping</ButtonLink>
            </CheckoutButton>
          </Card>
        ) : (
          <Card>
            <Table id='cart'>
              <THead>
                <tr>
                  <Th />
                  <Th>Item</Th>
                  <Th>Format</Th>
                  <Th>Price</Th>
                  <Th />
                </tr>
              </THead>
              <TBody>
                {this.props.cart.map((item, idx) => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <Image src={item.image} />
                      </td>
                      <Title>{item.name}</Title>
                      <td>
                        <FormatImage src={formatImage(item.format)} />
                      </td>
                      <td>
                        {Number(item.price).toLocaleString('en-CA', {
                          style: 'currency',
                          currency: 'CAD',
                        })}
                      </td>
                      <td>
                        <Button onClick={() => this.handleRemoveFromCart(idx)}>
                          Remove item
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </TBody>
              <TFoot>
                <tr>
                  <td />
                  <td />
                  <td>Total</td>
                  <td>
                    {this.props.cart
                      .map(item => Number(item.price))
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString('en-CA', {
                        style: 'currency',
                        currency: 'CAD',
                      })}
                  </td>
                  <td />
                </tr>
              </TFoot>
            </Table>
            <Buttons>
              <CheckoutButton>
                <ButtonLink to='/'>
                  <ButtonSmallText>Forgot something?</ButtonSmallText>Continue
                  shopping
                </ButtonLink>
              </CheckoutButton>
              <CheckoutButton>
                <ButtonLink to='/checkout' onClick={this.handleCheckout}>
                  <ButtonSmallText>Got everything?</ButtonSmallText>Checkout
                </ButtonLink>
              </CheckoutButton>
            </Buttons>
          </Card>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.items,
    users: state.users,
    query: state.searchQuery,
    cart: state.cart,
  };
};

export default withRouter(connect(mapStateToProps)(Cart));
