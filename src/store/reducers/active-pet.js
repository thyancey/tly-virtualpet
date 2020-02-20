import { 
  setActivePetId
} from '../actions';
import { 
  incrementXp,
  setMood,
  setActivity,
  augmentStat
} from '../actions/pet';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions'; 
import { getPetDefinition, getSavedStats, getBaseStats, augmentPetStat } from 'util/pet-store';

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
    return augmentThisStat(state, 'xp', action.payload, baseStats);
  },

  [augmentStat.toString()]: (state, action) => {
    const baseStats = getBaseStats(state.id);
    return augmentThisStat(state, action.payload.id, action.payload.value, baseStats);
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

const augmentThisStat = (state, statId, statValue, baseStats) => {
  if(!state.stats){
    return state;
  }
  
  augmentPetStat(state.id, statId, statValue)

  return state;
}