import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { getColor } from '@themes/';
import Cage from '@scenes/cage';

const S = {};
S.PetCell = styled.div`
  border: 5px solid white;
  height:200px;

  >div{
    display:inline-block;
    vertical-align:middle;
    height:100%;
  }
`

S.PetFrame = styled.div`
  width: 33%;
  border:1px solid red;
`;

S.Controls = styled.div`
  width: 66%;
  height: 100px;
  border:1px solid yellow;
`;

class PetCell extends Component {
  render(){
    return(
      <S.PetCell>
        <S.PetFrame>
            <Cage />
        </S.PetFrame>
        <S.Controls>
          <Button variant="contained" color="primary">This is a button</Button>
          <Button variant="contained" color="primary">This is a button</Button>
          <Button variant="contained" color="primary">This is a button</Button>
        </S.Controls>
      </S.PetCell>
    );
  }
}

export default PetCell;
