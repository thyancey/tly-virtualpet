import React, { Component } from 'react';
import styled from 'styled-components';

import Cage from '@scenes/cage';
import Info from '@scenes/info';

const S = {};
S.Main = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
`

S.Stage = styled.section`
  position:relative;
  width: 100%;
  height: 100%;

  padding: .5rem;
`

S.CageContainer = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:-1;
`;

S.InfoContainer = styled.div`
  /* allow canvas clicks under menu elements */
  pointer-events:none;

  margin:1rem;
  z-index:1;
  margin-top:5rem;
`;

class Main extends Component {
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
    return(
      <S.Main>
        <S.Stage>
          <S.InfoContainer  id="info-container">
            <Info />
          </S.InfoContainer>
          <S.CageContainer>
            <Cage />
          </S.CageContainer>
        </S.Stage>
      </S.Main>
    );
  }
}

export default Main;
