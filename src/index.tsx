import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './services/store';
import { fetchUserOrders } from './services/slices/userOrderSlice';

const token = localStorage.getItem('refreshToken');
if (token) {
  store.dispatch(fetchUserOrders());
}

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
