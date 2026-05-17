import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlices';
import orderReducer from './slices/orderSlice';
import userOrdersReducer from './slices/userOrderSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  order: orderReducer,
  userOrder: userOrdersReducer,
  user: userReducer
});
