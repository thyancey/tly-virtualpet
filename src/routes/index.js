import React from 'react'
import { Route, Switch } from 'react-router'
import { ThemeProvider } from 'styled-components'
import theme from 'themes/'
import App from 'scenes/app'

const routes = (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route component={App} />
    </Switch>
  </ThemeProvider>
)

export default routes