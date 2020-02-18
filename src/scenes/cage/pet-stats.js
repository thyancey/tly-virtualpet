import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import ProgressBar from '../../components/progress-bar';
import { incrementXp } from '../../store/actions/pet';
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
  incrementXp, 
  incrementFood, 
  incrementBladder, 
  incrementHappy, 
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
      <ProgressBar statObj={statsObj.xp} label={'XP'} incrementAction={(val) => incrementXp(val)} />
      <ProgressBar statObj={statsObj.stomach} label={'Food'} incrementAction={(val) => incrementFood(val)}/>
      <ProgressBar statObj={statsObj.bladder} label={'Bladder'} incrementAction={(val) => incrementBladder(val)}/>
      <ProgressBar statObj={statsObj.happyness} label={'Heppy'} incrementAction={(val) => incrementHappy(val)}/>
      <ProgressBar statObj={statsObj.hunger} label={'dHunger'} incrementAction={() => {}}/>
      <ProgressBar statObj={statsObj.boredom} label={'dBoredom'} incrementAction={() => {}}/>
    </$PetStats>
  );
}

export default PetStats;
