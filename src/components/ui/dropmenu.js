import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { themeGet, shadeColor } from '@themes/';
import ReactImageFallback from 'react-image-fallback';
const S = {};
S.MenuLabel = styled.div`
`

S.DropMenu = styled.div`
  cursor: pointer;
  padding: 1rem;
  font-size:3rem;
  font-weight: 600;
  margin-top: 1rem;
  width:100%;

  overflow:hidden;
 
  background-color: ${themeGet('color', 'blue')};
  color: ${themeGet('color', 'white')};
  text-shadow: .5px .5px 1.5px ${themeGet('color', 'black')};

  border: .2rem solid rgba(255, 255, 255, 0.2);
  border-radius:1rem;
  border-color:  rgba(0, 0, 0, .2) rgba(255, 255, 255, .2) rgba(255, 255, 255, .2) rgba(0, 0, 0, .2);
  box-shadow: -.1rem -.1rem .5rem black;

  &:hover{
    background-color: ${shadeColor('blue', 10)};
    text-shadow: 1.5px 1.5px 1.5px ${themeGet('color', 'black')};
    transform: translate(-1px, -1px);
    
    transition: background-color .1s ease-out, transform .1s ease-out;
  }

  &:active{
    background-color: ${shadeColor('blue', -10)};
    transform: translate(.5px, 1px);
    
    transition: background-color .1s ease-out, transform .1s ease-out;
  }
`;



S.DropItem = styled.div`
  padding:2rem 2rem;
  text-align:right;
  margin-top: 2rem;
  max-height:15rem;
  position:relative;

  >*{
    :first-child{
    }
    :last-child{
      flex:1;
    }
  }


  color: ${themeGet('color', 'white')};
  text-shadow: .5px .5px 1.5px ${themeGet('color', 'black')};
  background-color: ${themeGet('color', 'blue')};

  border: .2rem solid rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  box-shadow: .1rem .1rem .5rem black;

  transition: background-color .1s ease-out;

  &:hover{
    background-color: ${shadeColor('blue', 10)};
    text-shadow: 1.5px 1.5px 1.5px ${themeGet('color', 'black')};
    transform: translate(-1px, -1px);
    
    transition: background-color .1s ease-out, transform .1s ease-out;
  }
  
  &:active{
    background-color: ${shadeColor('blue', -10)};
    transform: translate(.5px, 1px);
    
    transition: background-color .1s ease-out, transform .1s ease-out;
  }

  ${p => p.isActive && css`
    color: ${themeGet('color', 'yellow')};
    text-shadow: 1px 1px 1.5px ${themeGet('color', 'black')};
    background-color: ${themeGet('color', 'green')};

    &:hover{
      background-color: ${shadeColor('green', 10)};
    }
  `}

  >div{
    display:inline-block;
    vertical-align:middle;
  }
`

S.DropItemImgContainer = styled.div`
  width:106px;
  height:106px;

  img{
    box-shadow: ${themeGet('shadow', 'z2')};
    border: .5rem solid ${themeGet('color', 'white')};
    border-radius: 50%;
    width:auto;
    height:100%;
  }

`;

S.DropItemLabel = styled.div`
  width:calc(100% - 106px);
`;

S.DropItems = styled.div`
`;

// export const DropMenu = ({ text, isActive, onClick, style, items = [] }) => {
export default class DropMenu extends Component {

  constructor(props){
    super(props);

    this.state = {
      isOpen: false
    }
  }

  onItemClicked(payload, e){
    if(this.props.onItemClick){
      this.props.onItemClick(payload, e);
    }
  }
  
  render(){
    const { 
      text,
      isActive, 
      activeId,
      onClick,
      style, 
      items
    } = this.props;

    return (
      <S.DropMenu isActive={isActive} onClick={(e) => onClick && onClick(e)} style={style} >
        <S.MenuLabel>{ text }</S.MenuLabel>
        <S.DropItems>
          {isActive && items.map((i, idx) => (
            <DropItem key={idx} isActive={i.id === activeId} thumbnail={`${i.dir}/assets/${i.thumbnail}`} text={i.text} subText={i.subText} onClick={e => this.onItemClicked(i.id, e)} />
          ))}
        </S.DropItems>
      </S.DropMenu>
    );
  }
}


export const DropItem = ({ text, subText, isActive, onClick, style, thumbnail }) => {
  return (
    <S.DropItem isActive={isActive} onClick={(e) => onClick && onClick(e)} style={style} >
      <S.DropItemImgContainer>
        <ReactImageFallback
          src={thumbnail}
          fallbackImage={'ui/unknown_thumbnail.jpg'}
          initialImage={'ui/unknown_thumbnail.jpg'}
          alt={text} />
      </S.DropItemImgContainer>
      <S.DropItemLabel>
        <h2>{ text }</h2>
        <h5>{ subText }</h5>
      </S.DropItemLabel>
    </S.DropItem>
  );
}
