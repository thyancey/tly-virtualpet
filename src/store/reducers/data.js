import { 
  setCustomData,
  setActivePetType,
  setActivePetId
} from '../actions';
import { 
  incrementXp,
  incrementFood,
  incrementPee,
  incrementHappy
} from '../actions/pet';
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


  [incrementXp.toString()]: (state, action) => {
    return augmentStat(state, 'xp', action.payload);
  },

  [incrementFood.toString()]: (state, action) => {
    return augmentStat(state, 'stomach', action.payload);
  },

  [incrementPee.toString()]: (state, action) => {
    return augmentStat(state, 'bladder', action.payload);
  },

  [incrementHappy.toString()]: (state, action) => {
    return augmentStat(state, 'happyness', action.payload);
  }
}, initialState);

const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
}

const augmentStat = (state, stat, value) => {
  const { pet, idx } = getActivePet(state);
  const newVal = pet.stats[stat] + value;
  let newStat = clamp(newVal, 0, pet.baseStats[stat])

  const updatedPet = {
    ...pet,
    stats:{
      ...pet.stats,
      [stat]: newStat
    }
  }
  
  return {
    ...state,
    customData:{
      ...state.customData,
      pets: Object.assign([], state.customData.pets, { [ idx ]: updatedPet })
    }
  }
}

const getActivePet = state => {
  const petIdx = state.customData.pets.findIndex(p => p.id === state.activePetId);

  return {
    pet: state.customData.pets[petIdx],
    idx: petIdx
  }
}