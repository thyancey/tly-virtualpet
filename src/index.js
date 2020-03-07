import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import theme from 'themes/'
import routes from './routes'

import Logger, { init as initLogger } from './util/logger';

const target = document.querySelector('#root')

global.store = store;
initLogger(0);
global.logger = Logger;

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        { routes }
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>,
  target
)
