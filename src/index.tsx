import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app';
import { ToastContainer } from 'react-toastify';
import { offers } from './mocks/offers';
import { store } from './store';
import { checkUserAuth, fetchOffers } from './store/async-actions';
import 'react-toastify/dist/ReactToastify.css';

store.dispatch(checkUserAuth());
store.dispatch(fetchOffers());

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <App offers={offers} />
    </Provider>
  </React.StrictMode>
);
