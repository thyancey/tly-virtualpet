import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

import ProgressBar from './progress-bar';

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

const PetStats = ({ petData, statsObj }) => {
  return (
    <$PetStats>
      <$Label>{`${petData.name} the ${petData.animal}`}</$Label>
      <p>{statsObj.level}</p>
      <p>{petData.id}</p>
      <ProgressBar statObj={statsObj.xp} label={'XP'} />
      <ProgressBar statObj={statsObj.stomach} label={'Hunger'} />
      <ProgressBar statObj={statsObj.bladder} label={'Gotta go'} />
      <ProgressBar statObj={statsObj.happyness} label={'Heppy'} />
    </$PetStats>
  );
}

export default PetStats;
