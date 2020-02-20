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

const PetStats = ({ 
  petData, 
  activity,
  mood,
  statsObj, 
  deltaStats,
  incrementXp, 
  augmentStat,
  setActivity, 
  setMood
}) => {
  return (
    <$PetStats>
      <$Label>{`${petData.name} the ${petData.animal}`}</$Label>
      <span>{`${petData.id} - ${statsObj.level}`}</span>
      <p>{'Activity'}</p>
      <LilButton isActive={activity === 'IDLE'} text={'IDLE'} onClick={e => setActivity && setActivity('IDLE')} />
      <LilButton isActive={activity === 'WALK'} text={'WALK'} onClick={e => setActivity && setActivity('WALK')} />
      <p>{'Mood'}</p>
      <LilButton isActive={mood === 'HAPPY'} text={'HAPPY'} onClick={e => setMood && setMood('HAPPY')} />
      <LilButton isActive={mood === 'SAD'} text={'SAD'} onClick={e => setMood && setMood('SAD')} />
      <ProgressBar statObj={statsObj.xp} label={'XP'} />
      {deltaStats.map((s, i) => (
        <ProgressBar key={i} statObj={s} label={s.label} augmentAction={(id, val) => augmentStat(id, val)}/>
      ))}
    </$PetStats>
  );
}

export default PetStats;
