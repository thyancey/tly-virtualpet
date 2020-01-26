// import { css } from 'styled-components';

export const themeGet = (...args) => props => {
  let current = props.theme;
  for (const arg of args) {
    if (!current[arg]) {
      console.error('[Theming] Could not find', arg, 'in', current); // eslint-disable-line no-console
      return '';
    }
    current = current[arg];
  }
  return current;
};

export default {
  color:{
    white: '#fef8dd',
    black: '#000000',
    blue: '#1fb9f3',
    green: '#51f249',
    grey: '#373737',
    purple: '#6b1ff3'
  },
  shadow:{
    z2: '-0.1rem 0.1rem .25rem .1rem rgba(0,0,0,0.36)',
    z3: '-.2rem .5rem 1rem .2rem rgba(0,0,0,.36)'
  },
  value:{
    headerHeight: '7.5rem'
  },
  mixins:{}
};