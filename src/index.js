import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import App from './scenes/app'
import { ThemeProvider } from 'styled-components'
import theme from 'themes/'
import routes from './routes'


const target = document.querySelector('#root')
global.store = store;
global.historyz = history;

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
