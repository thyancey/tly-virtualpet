import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getColors, themeGet } from 'themes/';
import Loader from './loader';
import Pinger from './pinger';

import { saveAllPetStatsToCookieNow } from 'util/pet-store';

import Palette from 'components/palette';

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

    global.spriteScale = 1; //- used to change sprite size/bounds, gets updated in cage.js when window is resized

    window.addEventListener('beforeunload', (e) => {
      this.onExitPage();
    });
  }

  onExitPage(){
    saveAllPetStatsToCookieNow();
  }

  render(){
    console.log('R: App', );
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

