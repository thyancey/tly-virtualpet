import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { themeGet, shadeColor } from 'themes/';
import ICON_EXPAND from './assets/unfold_more.svg';
import ICON_COLLAPSE from './assets/unfold_less.svg';

const $Base = styled.div`
  overflow-y:hidden;
  border-bottom: .5rem solid;
  box-shadow: 2px 2px 2px black;

  background-color: ${shadeColor('white', 0)};
  transition: background-color .5s, color .5s;

  &:hover{
    background-color: ${themeGet('color', 'green')};
    transition: background-color .5s, color .5s;
  }
  color: ${themeGet('color', 'black')};
`;

const $Header = styled.div`
  padding: 2rem 3rem;
  display:flex;
  align-items:center;
  cursor:pointer;

  img{
    width: 30px;
  }
  h2{
    flex:1;
    color: ${themeGet('color', 'black')};
    text-shadow: .1px .1px .5px ${themeGet('color', 'black')};
  }

  &:hover{
    h2{
      text-shadow: .25px .25px 1.5px ${themeGet('color', 'black')};
    }
  }
`;

const $Body = styled.div`
  padding: 0 3rem;
  max-height:0;
  ${p => p.isOpen && css`
    max-height: none;
  `}
`;


class PanelBase extends Component {
  constructor(props){
    super(props);

    this.onPanelClick = this.onPanelClick.bind(this);

    this.state = {
      isOpen: false
    }
  }

  onPanelClick(e){
    this.setState({ isOpen: !this.state.isOpen });
  }


  render(){
    return(
      <$Base>
        <$Header onClick={this.onPanelClick}>
          <h2>{this.props.label}</h2>
          {this.state.isOpen ? (
            <img src={ICON_EXPAND} alt="loading"/>
          ):(
            <img src={ICON_COLLAPSE} alt="loading"/>
          )}
        </$Header>
        <$Body isOpen={this.state.isOpen}>
          { this.props.children }
        </$Body>
      </$Base>
    );
  }
}

export default PanelBase;

