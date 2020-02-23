import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import ProgressBar from '../../components/progress-bar';

import { LilButton } from '../../components/button';

const $PetStats = styled.div`
  background-color:  ${themeGet('color', 'purple')};

  width: 40rem;

  border-radius: 2rem;
  padding: 1rem;
`

const $Label = styled.div`
  border-radius:2rem;
  background-color:white;
  color:black;
  margin:1rem;
  padding: 1rem;
  text-align:center;
`


const $StatDisplay = styled.div`
  text-align:right;
`

const $StatDisplayLabel = styled.span`
  color: ${themeGet('color', 'white')};
  font-size:2rem;
`
const $StatDisplayValue = styled.span`
  color: ${themeGet('color', 'green')};
  margin-left:1rem;
  font-size:3rem;
`

const StatDisplay = ({ statObj }) => {
  return (
    <$StatDisplay>
      <$StatDisplayLabel>{statObj.label}</$StatDisplayLabel>
      <$StatDisplayValue>{statObj.cur}</$StatDisplayValue>
    </$StatDisplay>
  );
};


const PetStats = ({ 
  petData, 
  activity,
  mood,
  deltaStats,
  augmentStat,
  setActivity, 
  setMood
}) => {
  return (
    <$PetStats>
      <$Label>{`${petData.name} the ${petData.animal}`}</$Label>
      <span>{`${petData.id}`}</span>
      <p>{'Activity'}</p>
      <LilButton isActive={activity === 'IDLE'} text={'IDLE'} onClick={e => setActivity && setActivity('IDLE')} />
      <LilButton isActive={activity === 'WALK'} text={'WALK'} onClick={e => setActivity && setActivity('WALK')} />
      <p>{'Mood'}</p>
      <LilButton isActive={mood === 'HAPPY'} text={'HAPPY'} onClick={e => setMood && setMood('HAPPY')} />
      <LilButton isActive={mood === 'SAD'} text={'SAD'} onClick={e => setMood && setMood('SAD')} />
      {deltaStats.map((s, i) => {
        if(s.type === 'number'){
          return (
            <StatDisplay key={i} statObj={s} />
          );
        }else{
          return (
            <ProgressBar key={i} statObj={s} label={s.label} augmentAction={(id, val) => augmentStat(id, val)}/>
          );
        }
      })}
    </$PetStats>
  );
}

export default PetStats;
