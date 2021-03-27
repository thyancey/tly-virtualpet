import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, ThemeProvider, createMuiTheme } from '@material-ui/core';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import blue from '@material-ui/core/colors/blue';
import PetCell from './pet-cell';
import { getColor } from '@themes/';

const S = {};
S.Editor = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
`

const theme = createMuiTheme({
  palette:{
    type: 'dark',
    primary:{
      // main: getColor('blue')
      main: blue[500]
    }
  },
});

class Editor extends Component {
  render(){
    return(
      <ThemeProvider theme={theme}>
        <ScopedCssBaseline>
          <S.Editor>
            <PetCell />
            <PetCell />
          </S.Editor>
        </ScopedCssBaseline>
      </ThemeProvider>
    );
  }
}

export default Editor;
