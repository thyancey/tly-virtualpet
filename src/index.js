import React from 'react';
import ReactDOM from 'react-dom';
// import App from './routes';
import AppContainer from '@scenes/app';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'styled-components'
import store from './store'
import theme from '@themes/'
import Logger, { init as initLogger } from './util/logger';


global.store = store;
initLogger(0);
global.logger = Logger;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
