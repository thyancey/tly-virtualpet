import React, { Component } from 'react';
import styled from 'styled-components';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { themeGet } from 'themes/';
import Loader from './loader';

import Stage from 'scenes/stage';
import Image_Comp from './assets/comp.jpg';

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

const $Comp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* width: 701px; */
  /* height: 1099px; */

  width:100%;
  height:100%;

  width:100%;
  img{
    width:100%;
    height:100%;
  }
`

class App extends Component {

  constructor(){
    super();
  }

  render(){
    return(
      <$App id="app" >
        <Loader/>
        <$Stage>
          <Stage />
        </$Stage>
        <$Comp>
          <img src={Image_Comp} alt="loading"/>
        </$Comp>
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

