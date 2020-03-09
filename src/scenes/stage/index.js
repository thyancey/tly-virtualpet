import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from 'components/button';

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

  padding: .5rem;
`

const $CageContainer = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
`;

const $Stuff = styled.div`
  display:flex;
  flex-direction:row;

  /* allow canvas clicks under menu elements */
  pointer-events:none;
`;

const $MenuContainer = styled.div`
  position:fixed;
  /* width:${MENU_WIDTH}; */

  top:0;
  right:0;
  z-index:1;
`;

const $InfoContainer = styled.div`
  margin:1rem;
  flex:1;
  z-index:1;
`;

const $MenuButton = styled.div`
  margin:1rem;
  z-index:1;
  button{
    padding:1.5rem 2rem;
    margin:0;
  }
`;


class Stage extends Component {
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
    console.log('R: Stage', this.props);
    const { } = this.props;

    return(
      <$Stage>
        <$Stuff>
          <$InfoContainer  id="info-container">
            <Info />
          </$InfoContainer>
          <$MenuButton>
            <Button text={'menu'} onClick={() => this.onToggleMenu()}/>
          </$MenuButton>
        </$Stuff>
        <$MenuContainer id="menu-container" >
          <Menu isOpen={this.state.isOpen} onToggleMenu={f => this.onToggleMenu(f)}/>
        </$MenuContainer>
        <$CageContainer>
          <Cage />
        </$CageContainer>
      </$Stage>
    );
  }
}

export default Stage;

