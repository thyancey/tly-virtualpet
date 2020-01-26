import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';

const $Pet = styled.div`
  position:absolute;
  width:30rem;
  height:30rem;

  bottom: 1rem;
  left:1rem;

  background-color:  ${themeGet('color', 'purple')};

  border-radius: 2rem;
  padding: 1rem;
`

const $Level = styled.p`
  position:absolute;
  right:1rem;
  top:1rem;

  width:6rem;
  height:6rem;
  border-radius:50%;
  background-color:white;
  color:black;
  padding: 1.4rem;
  text-align:center;

  font-size:3rem;
  font-weight:600;
`


const Pet = ({ level }) => {
  return (
    <$Pet>
      <$Level>{level}</$Level>
    </$Pet>
  );
}

export default Pet;
