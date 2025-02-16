import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import { checkUserAuth, fetchFavorites, fetchAllOffers } from './store/async-actions';
import 'react-toastify/dist/ReactToastify.css';

store.dispatch(checkUserAuth());
store.dispatch(fetchFavorites());
store.dispatch(fetchAllOffers());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App />
    </Provider>
  </React.StrictMode>
);
