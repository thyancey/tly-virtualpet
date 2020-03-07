import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet, shadeColor, getColor } from 'themes/';
import { LilButton } from 'components/button';
import { round, parseExpressionString } from 'util/tools';
import EffectMarker from './effect-marker';

import { send as sendLog } from 'util/logger';
import { send } from '../../../util/logger';

const STAT_AUGMENT_AMOUNT = 15;

const $ProgressBar = styled.div`
  position:relative;
  margin: 1rem;
  margin-bottom: 3rem;
  
  color: ${themeGet('color', 'black')};
`

const $Bar = styled.div`
  position:relative;
  border:.5rem solid ${themeGet('color', 'white')};
  border-radius: 1rem;
  overflow:hidden;
  padding:.25rem .5rem;
  text-align:center;
  background-color: ${themeGet('color', 'white')};

  box-shadow: 0px -2px 4px ${shadeColor('white', -40)};
`

const $Value = styled.span`
  position: relative;
  z-index:1;
  /* color: white; */
`

const $Label = styled.div`
  position:relative;
  display:inline;

  background-color:${themeGet('color', 'blue')};
  padding: .25rem 1rem .5rem 1rem;
  border-radius: 1rem 1rem 0rem 0rem;
  border: .5rem solid white;
  margin:0 0 -1rem .5rem;
  /* color:${themeGet('color', 'black')}; */

  >*{
    display:inline-block;
    vertical-align:middle;
  }

  h4{
    width:60%;
    font-size:2rem;
  display:inline;
  }
  div{
    width:40%;
  }
`

const $BarGroup = styled.div`
  position:relative;
  display:flex;
  flex-direction:column;

  
  >*{
    display:inline-block;
    vertical-align:middle;
  }


  >div{
    width:100%;
  }
  button{
    position:absolute;
    z-index:1;
    border: 5px solid white;
    box-shadow: none;
    margin: 0;
    padding: .2rem 1rem;

    &:first-child{
      /* background-color: ${themeGet('color', 'red')}; */
      left:-1rem;
      bottom: -1rem;
    }
    &:last-child{
      /* background-color: ${themeGet('color', 'green')}; */
      right:-1rem;
      bottom: 1rem;
    }
  }
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

const $EffectMarkers = styled.div`
  position:absolute;
  width:100%;
  height:100%;
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

const ProgressBar = ({ statObj, label, isActive, augmentAction, sceneStyles, moods }) => {
  // console.log('statObj', statObj);
  const alertType = getAlertType(statObj.fillType, statObj.percent, statObj.fullIsGood);
  const barColor = getBarColor(alertType, sceneStyles.bars);

  const bgColor_minus = statObj.fullIsGood ? getColor('red') : getColor('green');
  const bgColor_plus = statObj.fullIsGood ? getColor('green') : getColor('red');


  return (
    <$ProgressBar style={{ color: sceneStyles.text }}>
      <$Label>
        <h4>{label}</h4>
      </$Label>
      <$BarGroup>
        {augmentAction && (<LilButton text={'-'} onClick={e => augmentAction(statObj.id, -STAT_AUGMENT_AMOUNT)} style={{ backgroundColor: bgColor_minus }} />)}
        <$EffectMarkers>
          { statObj.effects.map((effect, idx) => (
            <EffectMarker key={idx} isOdd={idx % 2} isActive={moods.indexOf(effect.mood.id) > -1} effect={effect} statObj={statObj} colorObj={{ minus: bgColor_minus, plus: bgColor_plus }} />
          ))}
        </$EffectMarkers>
        <$Bar isActive={isActive} >
          <$Value>{ `${round(statObj.cur)} / ${statObj.max} (${round(statObj.percent)}%)` }</$Value>
          <$Bg progress={statObj.percent} barColor={barColor} />
        </$Bar>
        {augmentAction && (<LilButton text={'+'} onClick={e => augmentAction(statObj.id, STAT_AUGMENT_AMOUNT)} style={{ backgroundColor: bgColor_plus }} />)}
      </$BarGroup>
    </$ProgressBar>
  );
}

export default ProgressBar;
