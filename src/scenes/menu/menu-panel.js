import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet, getColor, shadeColor, getBreakpoint } from '@themes/';

import { Button } from '@components/ui/button';

import PanelBase from './components/panel-base';
import PanelPetSelection from './components/panel-petselection';
import PanelSettings from './components/panel-settings';

import { deleteAllData } from '@util/pet-store';
import { withRouter } from 'react-router-dom'

require('@themes/app.scss');

const S = {};
S.Menu = styled.div`
  position:absolute;
  top:0;
  right:0;
  width:100%;
  height:100%;
`;


S.MainPanel = styled.div`
  position:fixed;
  top:0rem;
  bottom:0;
  border-left: 1rem solid ${getColor('white')};
  box-shadow: ${themeGet('shadow', 'z3')};


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
S.PanelContainer = styled.div`
  width:100%;
  height:100%;
  /* padding: 2rem; */
`;

S.ResetButton = styled.div`
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
S.MenuButton = styled.div`
  margin:1rem;
  top:1rem;
  z-index:2;
  right:calc(100% + 2rem);
  position:absolute;

  button{
    padding:1.5rem 2rem;
    margin:0;
  }
`;

S.PanelBg = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  /* border-radius: 10px 0 0 10px; */

  z-index:-1;
  background-color: ${shadeColor('black', 0)};
  opacity:1;
`

class MenuPanel extends Component {
  render(){
    console.log('R: Menu', this.props.location);
    
    return(
      <S.Menu id="menu" >
        <S.MainPanel id="main-panel" isOpen={this.props.isOpen}>
          <S.MenuButton>
            <Button text={'menu'} onClick={() => this.props.onToggleMenu()}/>
          </S.MenuButton>
          <S.PanelContainer>
            <PanelBase label="Pet Selection">
              <PanelPetSelection onSelectPet={() => this.props.onToggleMenu(false)} />
            </PanelBase>
            <PanelBase label="Settings" >
              <PanelSettings />
            </PanelBase>
            <S.ResetButton>
              <Button text={'pet'} onClick={() => this.props.history.push(`/pet${this.props.location.search}`)} />
              <Button text={'editor'} onClick={() => this.props.history.push(`/editor${this.props.location.search}`)} />
              <Button text={'CLEAR SAVE'} onClick={() => deleteAllData()} style={{backgroundColor: getColor('red')}} />
            </S.ResetButton>
          </S.PanelContainer>
          <S.PanelBg/>
        </S.MainPanel>
      </S.Menu>
    );
  }
}

export default withRouter(MenuPanel);

