import React, { Component } from 'react';
import styled from 'styled-components';
import { LilButton } from '@components/ui/button';


import Menu from './menu-panel';

const S = {};
S.MenuContainer = styled.div`
  position:fixed;
  top:0;
  right:0;
  z-index:2;
`;

S.MenuButton = styled.div`
  position:absolute;
  right:.5rem;
  top:.5rem;
`;

class MenuController extends Component {
  constructor(){
    super();

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
    return(
      <S.MenuContainer id="menu-container" >
        <S.MenuButton>
          <LilButton text={'menu'} onClick={() => this.onToggleMenu()}/>
        </S.MenuButton>

        <Menu isOpen={this.state.isOpen} onToggleMenu={f => this.onToggleMenu(f)}/>
      </S.MenuContainer>
    );
  }
}

export default MenuController;
