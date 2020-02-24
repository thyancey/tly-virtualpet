import { 
  setActivePetId
} from '../actions';
import { 
  setMood,
  setActivity,
  augmentStat,
  resetPet
} from '../actions/pet';

import { handleActions } from 'redux-actions'; 
import { getPetDefinition, augmentPetStat, resetPetState } from 'util/pet-store';

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
    augmentPetStat(state.id, action.payload.id, action.payload.value);
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
  },

  [resetPet.toString()]: (state, action) => {
    const petId = action.payload;

    resetPetState(petId);

    return state;
  }
}, initialState);