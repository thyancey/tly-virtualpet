import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from 'themes/';
import { LilButton } from 'components/button';

const $ProgressBar = styled.div`
  margin: 1rem;
`

const $Bar = styled.div`
  position:relative;
  border:.5rem solid white;
  border-radius: 1rem;
  overflow:hidden;
  padding:.25rem .5rem;
`

const $Value = styled.span`
  position: relative;
  color: ${themeGet('color', 'white')};
  z-index:1;
  text-align:right;
  color: black;
`

const $Label = styled.div`
  position:relative;

  >*{
    display:inline-block;
    vertical-align:middle;
  }

  h4{
    width:60%;
    font-size:2rem;
  }
  div{
    width:40%;
  }
`

const $Buttons = styled.div`
text-align:right;
`

const $Bg = styled.div`
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width: ${p => p.progress + '%'};
  ${p => css`
    background-color: ${getAlertColor(p.alertType)};
  `}
 
  transition: width .3s ease-in-out, background-color .5s ease-in-out;
`

const getAlertColor = alertType => {
  switch(alertType){
    case 'normal': return themeGet('color', 'blue');
    case 'critical': return themeGet('color', 'red');
    case 'great': return themeGet('color', 'green');
    default: return themeGet('color', 'blue');
  }
}

const getAlertType = (fillType, percent) => {
  if(fillType === 'empty'){
    if(percent < 20){
      return 'great';
    } else if (percent > 80){
      return 'critical';
    }
  }else if(fillType === 'fill'){
    if(percent < 20){
      return 'critical';
    } else if (percent > 80){
      return 'great';
    }
  }

  return 'normal';
}

const ProgressBar = ({ statObj, label, isActive, incrementAction }) => {
  const alertType = getAlertType(statObj.fillType, statObj.percent);
  return (
    <$ProgressBar>
      <$Label>
        <h4>{label}</h4>

        <$Buttons>
          <LilButton text={'-'} onClick={e => incrementAction && incrementAction(-300)} />
          <LilButton text={'+'} onClick={e => incrementAction && incrementAction(300)} />
        </$Buttons>
      </$Label>
      <$Bar isActive={isActive} >
        <$Value>{ `${statObj.cur} / ${statObj.max} (${statObj.percent}%)` }</$Value>
        <$Bg progress={statObj.percent} alertType={alertType} />
      </$Bar>
    </$ProgressBar>
  );
}

export default ProgressBar;
