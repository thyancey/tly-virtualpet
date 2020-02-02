import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import ProgressBar from '../progress-bar';
import { incrementXp } from '../../store/actions/pet';

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

const PetStats = ({ petData, statsObj, incrementXp, incrementFood, incrementPee, incrementHappy }) => {
  return (
    <$PetStats>
      <$Label>{`${petData.name} the ${petData.animal}`}</$Label>
      <p>{statsObj.level}</p>
      <p>{petData.id}</p>
      <ProgressBar statObj={statsObj.xp} label={'XP'} incrementAction={(val) => incrementXp(val)} />
      <ProgressBar statObj={statsObj.stomach} label={'Food'} incrementAction={(val) => incrementFood(val)}/>
      <ProgressBar statObj={statsObj.bladder} label={'Gotta pee'} incrementAction={(val) => incrementPee(val)}/>
      <ProgressBar statObj={statsObj.happyness} label={'Heppy'} incrementAction={(val) => incrementHappy(val)}/>
    </$PetStats>
  );
}

export default PetStats;
