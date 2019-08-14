import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Navbar from './Navbar.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Market from './Market.jsx';
import ItemDetails from './ItemDetails.jsx';
import SellerDetails from './SellerDetails.jsx';
import AddItem from './AddItem.jsx';
import Cart from './Cart.jsx';
import Checkout from './Checkout.jsx';
import store from './store.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finishedLoading: false,
    };
  }

  async componentDidMount() {
    const responses = await Promise.all([
      await fetch('/setitems'),
      await fetch('/setusers'),
      await fetch('/setcart'),
    ]);
    const [items, users, cart] = await Promise.all(
      responses.map(async response => await response.json())
    );
    this.props.dispatch({
      type: 'SET_ITEMS',
      payload: items,
    });
    this.props.dispatch({
      type: 'SET_USERS',
      payload: users,
    });
    this.props.dispatch({
      type: 'SET_CART',
      payload: cart.cart,
    });
    this.setState({ finishedLoading: true });
  }
  renderLogin() {
    return <Login />;
  }

  renderSignup() {
    return <Signup />;
  }

  renderHome = () => {
    return <Market />;
  };

  renderItemDetails = routerData => {
    let itemId = routerData.match.params.id;
    console.log('App renderItemDetails itemId', itemId);
    let item = this.props.items.find(item => {
      return item.id === itemId;
    });
    console.log('item', item);
    return <ItemDetails item={item} users={this.props.users} />;
  };

  renderSellerDetails = routerData => {
    let sellerId = routerData.match.params.sid;
    console.log('App renderSellerDetails sellerId', sellerId);
    let sellerItems = this.props.items.filter(item => {
      return item.sellerId === sellerId;
    });
    console.log('App items props', this.props.items);
    console.log('App sellerItems', sellerItems);
    console.log('App users props', this.props.users);
    return (
      <SellerDetails
        sellerItems={sellerItems}
        users={this.props.users}
        sellerId={sellerId}
      />
    );
  };

  renderCart = () => {
    return <Cart />;
  };

  renderCheckout = () => {
    return <Checkout />;
  };

  render() {
    if (!this.state.finishedLoading) {
      console.log('App store if notLoading', store.getState());
      return 'Loading';
    }
    console.log('App store if Loading', store.getState());
    return (
      <BrowserRouter>
        <Navbar />
        <Route path='/login' exact={true} render={this.renderLogin} />
        <Route path='/signup' exact={true} render={this.renderSignup} />
        <Route path='/' exact={true} render={this.renderHome} />
        <Route
          path='/details/:id'
          exact={true}
          render={this.renderItemDetails}
        />
        <Route
          path='/seller/:sid'
          exact={true}
          render={this.renderSellerDetails}
        />
        <Route path='/additem' exact={true} component={AddItem} />
        <Route path='/cart' exact={true} render={this.renderCart} />
        <Route path='/checkout' exact={true} render={this.renderCheckout} />
      </BrowserRouter>
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

export default connect(mapStateToProps)(App);
