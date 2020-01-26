import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet } from 'themes/';

const $Button = styled.button`
  padding: 1rem 2rem;
  margin: 1rem;
  cursor:pointer;
  outline:0;
  
  border:none;
  border-radius: 1rem;

  background-color: ${themeGet('color', 'blue')};
  transition: background-color .1s ease-out;
  box-shadow: 2px 2px 2px ${themeGet('color', 'green')};

  &:hover{
    background-color: ${themeGet('color', 'green')};
    transition: background-color .1s ease-out;
  }

  ${p => p.isActive && css`
    color: ${themeGet('color', 'white')};
    background-color: ${themeGet('color', 'purple')};
    box-shadow: 2px 2px 2px ${themeGet('color', 'blue')};

    &:hover{
      background-color: ${themeGet('color', 'purple')};
    }
  `}

  font-size:2rem;
  font-weight: 500;

`;

const Button = ({ text, isActive, onClick }) => {
  return (
    <$Button isActive={isActive} onClick={(e) => onClick(e)}>
      <span>{ text }</span>
    </$Button>
  );
}

export default Button;
