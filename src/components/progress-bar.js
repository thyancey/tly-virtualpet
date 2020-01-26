import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from 'themes/';

const $ProgressBar = styled.div`
  margin: 1rem;
`;

const $Bar = styled.div`
  position:relative;
  border:.5rem solid white;
  border-radius: 1rem;
  overflow:hidden;
  padding:.25rem .5rem;
`;

const $Value = styled.span`
  position: relative;
  color: ${themeGet('color', 'white')};
  z-index:1;
  text-align:right;
  color: black;
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
 
  transition: width .3s ease-in-out;
`;

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
    if(percent < 30){
      return 'great';
    } else if (percent > 70){
      return 'critical';
    }
  }else if(fillType === 'fill'){
    if(percent < 30){
      return 'critical';
    } else if (percent > 70){
      return 'great';
    }
  }

  return 'normal';
}

const ProgressBar = ({ statObj, label, isActive }) => {
  const alertType = getAlertType(statObj.fillType, statObj.percent);
  return (
    <$ProgressBar>
      <h4>{label}</h4>
      <$Bar isActive={isActive} >
        <$Value>{ `${statObj.cur} / ${statObj.max} (${statObj.percent}%)` }</$Value>
        <$Bg progress={statObj.percent} alertType={alertType} />
      </$Bar>
    </$ProgressBar>
  );
}

export default ProgressBar;
