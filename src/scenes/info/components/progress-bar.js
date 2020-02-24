import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from 'themes/';
import { LilButton } from 'components/button';
import { round } from 'util/tools';

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
  z-index:1;
  text-align:right;
  color: white;
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
    background-color: ${p => p.barColor};
  `}
 
  transition: width .3s ease-in-out, background-color .5s ease-in-out;
`
const getAlertType = (fillType, percent, fullIsGood) => {
  if(fillType === 'empty'){
    if(percent < 20){
      return fullIsGood ? 'bad' : 'good';
    } else if (percent > 80){
      return fullIsGood ? 'good' : 'bad';
    }
  }else if(fillType === 'fill'){
    if(percent < 20){
      return fullIsGood ? 'bad' : 'good';
    } else if (percent > 80){
      return fullIsGood ? 'good' : 'bad';
    }
  }

  return 'neutral';
}


const getBarColor = (alertType, barStyles) => {
  return barStyles[alertType] || barStyles['neutral'] || 'white';
}

const ProgressBar = ({ statObj, label, isActive, augmentAction, sceneStyles }) => {

  const alertType = getAlertType(statObj.fillType, statObj.percent, statObj.fullIsGood);
  const barColor = getBarColor(alertType, sceneStyles.bars);
  
  return (
    <$ProgressBar style={{ color: sceneStyles.text }}>
      <$Label>
        <h4>{label}</h4>

        {augmentAction && (
          <$Buttons>
            <LilButton text={'-'} onClick={e => augmentAction(statObj.id, -30)} />
            <LilButton text={'+'} onClick={e => augmentAction(statObj.id, 30)} />
          </$Buttons>
        )}
      </$Label>
      <$Bar isActive={isActive} >
        <$Value>{ `${round(statObj.cur)} / ${statObj.max} (${round(statObj.percent)}%)` }</$Value>
        <$Bg progress={statObj.percent} barColor={barColor} />
      </$Bar>
    </$ProgressBar>
  );
}

export default ProgressBar;
