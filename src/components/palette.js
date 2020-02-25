import React from 'react';
import styled, { css } from 'styled-components';
import { themeGet, getColors } from 'themes/';

const $Palette = styled.div`
  position:fixed;
  top:50%;
  transform:translateY(-50%);
  text-align:center;
  z-index: 999999;
  border: 1px dashed ${p => themeGet('color', 'white')};
`
const $PaletteItem = styled.div`
  background-color: ${p => themeGet('color', p.color)};
  width:4rem;
  height:8rem;
  display:inline-block;
  vertical-align:top;
`

export default () => (
  <$Palette>
    { getColors().map((color, idx) => (
      <$PaletteItem key={idx} color={color} />
    ))}
  </$Palette>
);