import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet, getColors } from '@themes/';

const S = {};

S.Palette = styled.div`
    position:fixed;
    top:50%;
    transform:translateY(-50%);
    text-align:center;
    z-index: 999999;
    border: 1px dashed ${p => themeGet('color', 'white')};
`;

S.PaletteItem = styled.div`
  background-color: ${p => themeGet('color', p.color)};
  width:4rem;
  height:8rem;
  display:inline-block;
  vertical-align:top;
`;

const Palette = () => (
  <S.Palette>
    { getColors().map((color, idx) => (
      <S.PaletteItem key={idx} color={color} />
    ))}
  </S.Palette>
);

export default Palette;