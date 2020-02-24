import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet } from 'themes/';

import { Button } from 'components/button';

import PetSelection from './components/pet-selection';


require('themes/app.scss');



const $Menu = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:100%;
  height:100%;
`;

const $MenuButton = styled.div`
  position:absolute;
  right:1rem;
  top:1rem;
  z-index:1;
  button{
    padding:3rem 4rem;
  }
`;

const $MainPanel = styled.div`
  position:fixed;
  top:0;
  right:0%;
  bottom:0;
  width:90%;

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

class Menu extends Component {
  constructor(props){
    super(props);

    this.state = {
      isOpen: false
    }
  }


  onToggleMenu(force){
    this.setState({
      isOpen: force !== undefined ? force : !this.state.isOpen
    });
  }

  render(){
    // console.log('R: Menu');
    return(
      <$Menu id="menu" >
        <$MenuButton>
          <Button text={'menu'} onClick={e => this.onToggleMenu()}/>
        </$MenuButton>
        <$MainPanel id="main-panel" isOpen={this.state.isOpen}>
          <$PanelContainer>
            <PetSelection onSelectPet={() => this.onToggleMenu()} />
          </$PanelContainer>
        </$MainPanel>
      </$Menu>
    );
  }
}

export default Menu;

