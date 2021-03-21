import React, { Component } from 'react';
import styled from 'styled-components';

const S = {};
S.Editor = styled.div`
  position:absolute;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1;
`

class Editor extends Component {
  render(){
    return(
      <S.Editor>
        {'Editor'}
      </S.Editor>
    );
  }
}

export default Editor;
