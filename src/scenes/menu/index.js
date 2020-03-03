import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet, getColor, shadeColor, getBreakpoint } from 'themes/';

import { Button } from 'components/button';

import PetSelection from './components/pet-selection';

import { deleteAllData } from 'util/pet-store';

require('themes/app.scss');

const $Menu = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:100%;
  height:100%;
`;


const $MainPanel = styled.div`
  position:fixed;
  top:0rem;
  bottom:0;


  @media ${getBreakpoint.mobile_tiny}{
    max-width: calc(100% - 15rem);
  }
  @media ${getBreakpoint.tablet}{
    max-width: calc(50%);
  }
  width:100%;

  padding-right:0;
  

  ${p => p.isOpen ? 
    css`
      right:0%;
      transition:right .2s ease-in;
    `: 
    css`
      right:-100%;
      transition:right .3s ease-in;
    `
  }
`;
const $PanelContainer = styled.div`
  width:100%;
  height:100%;
  padding: 2rem;
`;

const $ResetButton = styled.div`
  position:absolute;
  right:1rem;
  bottom:1rem;
  button{
    background-color: ${getColor('black')};

    &:hover{
      background-color: ${getColor('red')};
    }
    &:active{
      background-color: ${shadeColor('red', -20)};
    }
  }
`
const $MenuButton = styled.div`
  margin:1rem;
  top:1rem;
  right:1rem;
  z-index:2;
  right:100%;
  position:absolute;

  button{
    padding:1.5rem 2rem;
    margin:0;
  }
`;

const $PanelBg = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  /* border-radius: 10px 0 0 10px; */

  z-index:-1;
  background-color: ${themeGet('color', 'white')};
  border-left: .5rem solid white;
  box-shadow: ${themeGet('shadow', 'z3')};
  opacity:1;
`

class Menu extends Component {
  render(){
    // console.log('R: Menu');
    return(
      <$Menu id="menu" >
        <$MainPanel id="main-panel" isOpen={this.props.isOpen}>
          <$MenuButton>
            <Button text={'menu'} onClick={() => this.props.onToggleMenu()}/>
          </$MenuButton>
          <$PanelContainer>
            <PetSelection onSelectPet={() => {}} />
            <$ResetButton>
              <Button text={'CLEAR SAVE'} onClick={() => deleteAllData()} />
            </$ResetButton>
          </$PanelContainer>
          <$PanelBg/>
        </$MainPanel>
      </$Menu>
    );
  }
}

export default Menu;

