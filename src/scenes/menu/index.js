import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet, getColor, shadeColor } from 'themes/';

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
  width:90%;

  padding-top: 10rem;
  padding-bottom: 4rem;
  padding-right:0;
  

  ${p => p.isOpen ? 
    css`
      right:0%;
      transition:right .2s ease-in;
    `: 
    css`
      right:-90%;
      transition:right .3s ease-in;
    `
  }
`;
const $PanelContainer = styled.div`
  width:100%;
  height:100%;
  position:relative;
  border-radius: 2rem 0 0 2rem;
  background-color: ${themeGet('color', 'black')};
  padding: 2rem;

  border: 1rem solid white;
  border-right:0;

  box-shadow: ${themeGet('shadow', 'z3')}
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

class Menu extends Component {
  render(){
    // console.log('R: Menu');
    return(
      <$Menu id="menu" >
        <$MainPanel id="main-panel" isOpen={this.props.isOpen}>
          <$PanelContainer>
            <PetSelection onSelectPet={() => this.props.onToggleMenu()} />
            <$ResetButton>
              <Button text={'CLEAR SAVE'} onClick={() => deleteAllData()} />
            </$ResetButton>
          </$PanelContainer>
        </$MainPanel>
      </$Menu>
    );
  }
}

export default Menu;

