import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Item from './Item.jsx';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
`;

const SellerName = styled.h3``;

const ItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-around;
`;

class SellerDetails extends Component {
  render() {
    console.log('SellerSetails sellerItems', this.props.sellerItems);
    let results = this.props.sellerItems.filter(item => {
      return item.name.toLowerCase().includes(this.props.query.toLowerCase());
    });
    const usersArray = Object.values(this.props.users);
    console.log('SellerDetails users prop', this.props.users);
    console.log('SellerDetails usersArray', usersArray);
    return (
      <Wrapper>
        <SellerName>
          {usersArray.find(seller => seller.id === this.props.sellerId).name}
          's store
        </SellerName>
        <ItemsWrapper>
          {results.map(item => {
            return (
              <Item
                image={item.image}
                name={item.name}
                format={item.format}
                price={item.price}
                id={item.id}
                sellerId={item.sellerId}
                seller={item.seller}
                key={item.id}
              />
            );
          })}
        </ItemsWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    login: state.loggedIn,
    items: state.items,
    query: state.searchQuery,
    users: state.users,
  };
};

export default connect(mapStateToProps)(SellerDetails);
