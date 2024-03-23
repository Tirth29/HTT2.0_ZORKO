import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./Reducers/UserReducer";
import { otherReducer } from "./Reducers/otherReducer";
import { productReducer } from "./Reducers/productReducer";
import { cartReducer } from "./Reducers/CartReducers";
export const Store = configureStore({
  reducer: {
    user: userReducer,
    other: otherReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export const server = "https://htt-production.up.railway.app/api/v1";
// export const server = "http://192.168.23.99:5000/api/v1"
// export const server = "http://192.168.121.69:5000/api/v1";
// export const server = "https://e-commerceserver-123.up.railway.app/api/v1";
