import { 
  setActivePetId
} from '../actions';
import { 
  incrementXp,
  setMood,
  setActivity
} from '../actions/pet';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions'; 
import { getPetDefinition, getSavedStats, getBaseStats } from 'util/pet-store';

const initialState = {
  id: null,
  mood: null,
  activity:null,
  stats: null
};

export default handleActions({
  [setActivePetId.toString()]: (state, action) => {
    const petObj = getPetDefinition(action.payload);
    //- get stats, etc

    const stats = getSavedStats(action.payload);
    
    return {
      ...state,
      id: petObj.id,
      stats: stats
    }
  },

  [incrementXp.toString()]: (state, action) => {
    const baseStats = getBaseStats(state.id);
    return augmentStat(state, 'xp', action.payload, baseStats);
  },

  [setMood.toString()]: (state, action) => {
    return {
      ...state,
      mood: action.payload
    }
  },

  [setActivity.toString()]: (state, action) => {
    return {
      ...state,
      activity: action.payload
    }
  }
}, initialState);

const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
}

const augmentStat = (state, stat, value, baseStats) => {
  if(!state.stats){
    return state;
  }
  const newVal = state.stats[stat] + value;
  let newValue = clamp(newVal, 0, baseStats[stat]);

  return {
    ...state,
    stats:{
      ...state.stats,
      [stat]: newValue
    }
  }
}

const getPetStats = petObj => {
  //- eventually, this uses time, base stats, etc to save current unique stats
  return petObj.baseStats;
}