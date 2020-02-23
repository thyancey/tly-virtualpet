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
import { getPetDefinition, augmentPetStat } from 'util/pet-store';

const initialState = {
  id: null,
  mood: null,
  activity:null
};

export default handleActions({
  [setActivePetId.toString()]: (state, action) => {
    const petObj = getPetDefinition(action.payload);
    //- get stats, etc
    
    return {
      ...state,
      id: petObj.id
    }
  },

  [augmentStat.toString()]: (state, action) => {
    // console.log('augmentStat', action.payload);

    augmentPetStat(state.id, action.payload.id, action.payload.value)
    return state;
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