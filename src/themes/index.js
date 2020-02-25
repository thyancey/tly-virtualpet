import { css } from 'styled-components';

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

export const getColors = (colorId) => {
  return Object.keys(store.color);
}

export const getColor = (colorId) => {
  return store.color[colorId];
}

export const mixin_clearBubble = () => {
  return css`
    border: .2rem solid rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    box-shadow: .1rem .1rem .5rem black;
  `;
}

export const mixin_textStroke = (thickness, spread, color) => {
  return css`
    text-shadow:  -${thickness} -${thickness} ${spread} ${color},
                  ${thickness} -${thickness} ${spread} ${color},
                  -${thickness} ${thickness} ${spread} ${color},
                  ${thickness} ${thickness} ${spread} ${color},
                  -${thickness} -${thickness} ${spread} ${color},
                  ${thickness} -${thickness} ${spread} ${color},
                  -${thickness} ${thickness} ${spread} ${color},
                  ${thickness} ${thickness} ${spread} ${color},
                  -${thickness} -${thickness} ${spread} ${color},
                  ${thickness} -${thickness} ${spread} ${color},
                  -${thickness} ${thickness} ${spread} ${color},
                  ${thickness} ${thickness} ${spread} ${color},
                  -${thickness} -${thickness} ${spread} ${color},
                  ${thickness} -${thickness} ${spread} ${color},
                  -${thickness} ${thickness} ${spread} ${color},
                  ${thickness} ${thickness} ${spread} ${color};
  `;
}


const store = {
  color:{
    black: '#000000',
    grey: '#373737',
    grey_light: '#A39F8E',
    white: '#fef8dd',
    blue: '#1fb9f3',
    green: '#51f249',
    yellow: '#fff249',
    red: '#F55658',
    purple: '#6b1ff3'
  },
  shadow:{
    z2: '-0.1rem 0.1rem .25rem .1rem rgba(0,0,0,0.36)',
    z3: '-.2rem .5rem 1rem .2rem rgba(0,0,0,.36)'
  },
  value:{
    headerHeight: '7.5rem',
    menuWidth: '12rem'
  },
  mixins:{}
}


/* from pablo on https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors */
export const shadeColor = (colId, percent) => {
  var color = store.color[colId] || colId;

  var R = parseInt(color.substring(1,3),16);
  var G = parseInt(color.substring(3,5),16);
  var B = parseInt(color.substring(5,7),16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}
export default store;