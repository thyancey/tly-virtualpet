import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';
import Loader from './loader';
import Pinger from './pinger';

import Stage from 'scenes/stage';

require('themes/app.scss');

const $App = styled.section`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  overflow:hidden;

  background-color:  ${themeGet('color', 'black')};
  color: ${themeGet('color', 'blue')};
`

const $Stage = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
`

class App extends Component {

  constructor(){
    super();
  }

  render(){
    // console.log('R: App');
    return(
      <$App id="app" >
        <Pinger />
        <Loader/>
        <$Stage>
          <Stage />
        </$Stage>
      </$App>
    );
  }
}

const mapStateToProps = (state) => ({
  loaded: state.data.loaded
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

