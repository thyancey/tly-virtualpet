import React, { Component } from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import Cage from 'scenes/cage';
import Menu from 'scenes/menu';
import Info from 'scenes/info';

import {} from 'store/selectors';


require('themes/app.scss');

const MENU_WIDTH = '18rem';

const $Stage = styled.section`
  position:relative;
  width: 100%;
  height: 100%;

  padding: 2rem;
`

const $CageContainer = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
`;


const $MenuContainer = styled.div`
  position:fixed;
  width:${MENU_WIDTH};

  top:0;
  right:0;
  z-index:1;
`;

const $InfoContainer = styled.div`
  position:fixed;
  width: calc(100% - ${MENU_WIDTH});

  top:0;
  left:0;
  z-index:1;
`;

class Stage extends Component {
  render(){
    // console.log('R: Stage');
    const { } = this.props;

    return(
      <$Stage>
        <$InfoContainer  id="info-container">
          <Info />
        </$InfoContainer>
        <$MenuContainer id="menu-container">
          <Menu />
        </$MenuContainer>
        <$CageContainer>
          <Cage  />
        </$CageContainer>
      </$Stage>
    );
  }
}

export default Stage;

