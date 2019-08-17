import { createStore } from 'redux';
import Cookies from 'js-cookie';

let reducer = (state, action) => {
  console.log('reducer', action);
  if (action.type === 'SIGNUP_SUCCESS') {
    return {
      ...state,
      users: { ...state.users, [action.username]: action.payload },
    };
  }
  if (action.type === 'LOGIN_SUCCESS') {
    return {
      ...state,
      loggedIn: true,
      name: action.name,
      username: action.username,
    };
  }
  if (action.type === 'LOGOUT') {
    return { ...state, loggedIn: false, name: null };
  }
  if (action.type === 'SET_QUERY') {
    return { ...state, searchQuery: action.query };
  }
  if (action.type === 'ADD_ITEM') {
    return { ...state, items: [...state.items, action.payload] };
  }
  if (action.type === 'ADD_TO_CART') {
    const copyCart = [...state.cart];
    copyCart.push(action.payload);
    return { ...state, cart: copyCart };
  }
  if (action.type === 'REMOVE_FROM_CART') {
    const copyCart = [...state.cart];
    return {
      ...state,
      cart: action.payload,
    };
  }
  if (action.type === 'CHECKOUT') {
    const copyItems = [...state.items];
    for (let i = 0; i < action.payload.length; i++) {
      for (let j = 0; j < copyItems.length; j++) {
        if (action.payload[i].id === copyItems[j].id) {
          copyItems.splice(j, 1);
        }
      }
    }
    const copyCart = [...state.cart];
    return { ...state, items: copyItems, cart: [] };
  }
  if (action.type === 'SET_ITEMS') {
    return { ...state, items: action.payload };
  }
  if (action.type === 'SET_USERS') {
    return { ...state, users: action.payload };
  }
  if (action.type === 'SET_CART') {
    return { ...state, cart: action.payload };
  }
  return state;
};
const hasSessionId = document.cookie.includes('sid=');
const name = Cookies.get('name');

const initialState = {
  items: [],
  users: {},
  cart: [],
  loggedIn: false,
  name: null,
  searchQuery: '',
  username: null,
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
