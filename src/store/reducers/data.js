import { 
  setCustomData,
  setActivePetType,
  setActivePetId,
  incrementCounter,
  decrementCounter
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';

//- customData in store is from an external json file at public/data.json
const VALID_KEYS = [ 'customTitle', 'customValue', 'customArray', 'customObjects' ];
const RESTRICT_KEYS = false;
 
const initialState = {
  loaded: false,
  title: 'loading',
  customData: null,
  counter: 0,
  activePetType: null,
  activePetId: null
}

export default handleActions({
  [setCustomData.toString()]: (state, action) => {
    const cleanObj = {};
    const parsedData = action.payload;
    for(let key in parsedData){
      if(VALID_KEYS.indexOf(key) === -1){
        console.warn(`key supplied in /data.json "${key}" is not a valid key`);
        if(!RESTRICT_KEYS) cleanObj[key] = parsedData[key];
      }
      else{
        cleanObj[key] = parsedData[key];
      }
    }

    return {
      ...state,
      customData: cleanObj,
      loaded: true
    }
  },

  [setTransition.toString()]: (state, action) => {
    return {
      ...state,
      transitionLabel: action.payload.label
    }
  },

  [setActivePetType.toString()]: (state, action) => {
    return {
      ...state,
      activePetType: action.payload
    }
  },

  [setActivePetId.toString()]: (state, action) => {
    return {
      ...state,
      activePetId: action.payload
    }
  },

  [incrementCounter.toString()]: (state, action) => {
    console.log('ICREMEMRM')
    return {
      ...state,
      counter: state.counter + 1
    }
  },

  [decrementCounter.toString()]: (state, action) => {
    return {
      ...state,
      counter: state.counter - 1
    }
  }
}, initialState);
