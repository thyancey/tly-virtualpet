import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet, mixin_textStroke, shadeColor } from '../../themes';

const $NotAButton = styled.div`
  color: ${themeGet('color', 'grey')};
  text-shadow: .5px .5px 1.5px ${themeGet('color', 'black')};
  /* background-color: ${themeGet('color', 'grey')}; */
  /* border-radius: 1rem; */
  /* border: .2rem solid rgba(255, 255, 255, 0.2); */

  display:inline-block;


  
  border: .2rem solid rgba(255, 255, 255, 0.2);
  border-radius:1rem;
  border-color:  rgba(0, 0, 0, .2) rgba(255, 255, 255, .2) rgba(255, 255, 255, .2) rgba(0, 0, 0, .2);
  box-shadow: -.1rem -.1rem .5rem black;
  background-color: ${themeGet('color', 'black')};


  
  ${p => p.isActive && css`
    color: ${themeGet('color', 'grey')};
    text-shadow: .5px .5px .75px ${themeGet('color', 'black')};
    background-color: ${themeGet('color', 'yellow')};
  `}

  
  padding: .5rem 1.5rem;
  margin: .5rem;
  font-size: 2rem;
  font-weight: 600;

  span{
  }
`

const $Button = styled.button`
  cursor:pointer;
  position:relative;

  pointer-events: all;
  outline:0;
  
  border:none;
  border-radius: 1rem;

  font-size:3rem;

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

    .button-tooltip{
      opacity:1;
      left:100%;
    }
  }
  
  &:active{
    /* down state wasnt resetting on buttons that slid out */

    
    /* background-color: ${shadeColor('blue', -10)}; */
    /* transform: translate(.5px, 1px); */
    
    /* transition: background-color .1s ease-out, transform .1s ease-out; */
  }

  ${p => p.isDisabled && css`
    color: ${themeGet('color', 'black')};
    text-shadow: 1px 1px 1.5px ${themeGet('color', 'black')};
    background-color: ${themeGet('color', 'grey')};

    &:hover{
      background-color: ${shadeColor('grey', 10)};
    }
  `}

  ${p => p.isActive && css`
    color: ${themeGet('color', 'yellow')};
    text-shadow: 1px 1px 1.5px ${themeGet('color', 'black')};
    background-color: ${themeGet('color', 'green')};

    &:hover{
      background-color: ${shadeColor('green', 10)};
    }
  `}
`;

const $BigButton = styled($Button)`
  padding: 1rem 2rem;
  margin: 1rem;
  font-size:3rem;
  font-weight: 600;
`;


const $LilButton = styled($Button)`
  padding: .5rem 1.5rem;
  margin: .5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const $Tooltip = styled.div`
  z-index:1;
  opacity:0;
  left:0%;

  pointer-events:none;

  position:absolute;
  top:50%;
  transform: translateY(-50%);


  transition: opacity .4s ease-in-out, left .2s ease-in-out;
  padding:.5rem 1rem;

  color: ${themeGet('color', 'black')};
  background-color: ${themeGet('color', 'white')};

  border-radius:1rem;
  margin:1;
  white-space:pre-line;
  min-width:auto;
  max-width:auto;

  font-size: 1.5rem;
  text-shadow:none;
  margin-left:1rem;
`;

const Tooltip = ({ text }) => {
  return (
    <$Tooltip className="button-tooltip">
      <p>{text}</p>
    </$Tooltip>
  )
}

export const Button = ({ text, isActive, isDisabled, onClick, style, tooltip }) => {
  return (
    <$BigButton isActive={isActive} disabled={isDisabled} isDisabled={isDisabled} onClick={(e) => onClick && onClick(e)} style={style} title={tooltip} >
      <span>{ text }</span>
      {tooltip && <Tooltip text={tooltip} />}
    </$BigButton>
  );
}

export const LilButton = ({ text, isActive, isDisabled, onClick, style, tooltip }) => {
  return (
    <$LilButton isActive={isActive} disabled={isDisabled} isDisabled={isDisabled} onClick={(e) => onClick && onClick(e)} style={style} title={tooltip}>
      <span>{ text }</span>
      {tooltip && <Tooltip text={tooltip} />}
    </$LilButton>
  );
}

export const NotAButton = ({ text, isActive, isDisabled, onClick, style }) => {
  return (
    <$NotAButton isActive={isActive} onClick={(e) => onClick && onClick(e)} style={style} >
      <span>{ text }</span>
    </$NotAButton>
  );
}
