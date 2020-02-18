import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from 'themes/';

const $Button = styled.button`
  cursor:pointer;
  outline:0;
  
  border:none;
  border-radius: 1rem;

  background-color: ${themeGet('color', 'blue')};
  transition: background-color .1s ease-out;
  box-shadow: 2px 2px 2px ${themeGet('color', 'green')};

  &:hover{
    color: ${themeGet('color', 'white')};
    background-color: ${themeGet('color', 'purple')};
    transition: background-color .1s ease-out;
  }

  ${p => p.isActive && css`
    color: ${themeGet('color', 'black')};
    background-color: ${themeGet('color', 'green')};
    box-shadow: 2px 2px 2px ${themeGet('color', 'blue')};

    &:hover{
      background-color: ${themeGet('color', 'green')};
    }
  `}
`;

const $BigButton = styled($Button)`
  padding: 1rem 2rem;
  margin: 1rem;
  font-size:2rem;
  font-weight: 600;
`;


const $LilButton = styled($Button)`
  padding: .5rem 1.5rem;
  margin: .5rem;
  font-size: 2rem;
  font-weight: 600;
`;

export const Button = ({ text, isActive, onClick }) => {
  return (
    <$BigButton isActive={isActive} onClick={(e) => onClick && onClick(e)} >
      <span>{ text }</span>
    </$BigButton>
  );
}

export const LilButton = ({ text, isActive, onClick }) => {
  return (
    <$LilButton isActive={isActive} onClick={(e) => onClick && onClick(e)} >
      <span>{ text }</span>
    </$LilButton>
  );
}
