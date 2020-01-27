import React from 'react';
import styled from 'styled-components';

import { themeGet } from 'themes/';
import ReactImageFallback from 'react-image-fallback';
import Image_404Pet from './assets/unknown-pet.jpg';

const $Pet = styled.div`
  position:absolute;
  width:30rem;
  height:30rem;

  bottom: 1rem;
  left:1rem;

  background-color:  ${themeGet('color', 'purple')};

  border: 1rem solid ${themeGet('color', 'purple')};
  border-radius: 2rem;

  overflow:hidden;

  img{
    width:100%;
  }
`

const $Level = styled.p`
  position:absolute;
  right:-1rem;
  top:-1rem;

  width:6rem;
  height:6rem;
  border-radius: 0 2rem 0 50%;
  background-color:white;
  color:black;
  text-align:center;

  border: 1rem solid ${themeGet('color', 'purple')};
  box-shadow: .2rem .2rem .2rem black;

  font-size:3rem;
  font-weight:600;
`


const Pet = ({ level, imageUrl }) => {
  return (
    <$Pet>
      <$Level>{level}</$Level>
      <ReactImageFallback
          src={imageUrl}
          fallbackImage={Image_404Pet}
          alt={'pet'}
          className={'card-image-div'} />
    </$Pet>
  );
}

export default Pet;
