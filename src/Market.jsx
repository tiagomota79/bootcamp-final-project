import React, { Component } from 'react';
import { connect } from 'react-redux';
import Item from './Item.jsx';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: space-around;
`;

class Market extends Component {
  render() {
    console.log('Market', this.props.items);

    let results = this.props.items.filter(item => {
      return item.name.toLowerCase().includes(this.props.query.toLowerCase());
    });
    return (
      <Wrapper>
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

export default connect(mapStateToProps)(Market);
