import { createContext, useReducer } from 'react';
import React from 'react';
export const Store = createContext();

const initialState = {
  UserInfo:
    localStorage.getItem('UserInfo') ? JSON.parse(localStorage.getItem('UserInfo')) : null
  ,

  cart: {
    ShippingAddress: localStorage.getItem('ShippingAddress') ? JSON.parse(localStorage.getItem('ShippingAddress')) : {},
    PaymentMethod: localStorage.getItem('PaymentMethod') ? localStorage.getItem('PaymentMethod') : '',
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
          item._id === existItem._id ? newItem : item
        )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // save cart items to local storage avoids page refresh deletion of cart items
      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      // remove from cart
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // save cart items to local storage avoids page refresh deletion of cart items
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      // sign in
      return { ...state, UserInfo: action.payload };

    case 'USER_SIGNOUT':
      // sign out
      return {
        ...state, UserInfo: null,
        cart: { cartItems: [], ShippingAddress: {} }, PaymentMethod: '',
      };

    case 'SAVE_SHIPPING_ADDRESS':
      // save shipping address
      return {
        ...state, cart: {
          ...state.cart,
          ShippingAddress: action.payload
        }
      };

    case 'SAVE_PAYMENT_METHOD':
      // save payment method
      return { ...state, cart: { ...state.cart, PaymentMethod: action.payload } };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
