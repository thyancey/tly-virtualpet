import { 
  setActivePetId
} from '../actions';
import { 
  setMood,
  setActivity,
  augmentStat,
  resetPet,
  killPet
} from '../actions/pet';

import { handleActions } from 'redux-actions'; 
import { getPetDefinition, augmentPetStat, resetPetState, deleteAllData, killThisPet } from 'util/pet-store';
import { changeQueryObj } from 'util/tools';

const initialState = {
  id: null,
  mood: null,
  isAlive: true,
  activity:null
};

export default handleActions({
  [setActivePetId.toString()]: (state, action) => {
    const petObj = getPetDefinition(action.payload);
    //- get stats, etc

    //- update the route
    changeQueryObj('pet', petObj.id, global.location.search);
    // const found = allPets.find(p => p.id === activePetId);
    console.log('petfdfsfsdfdsffsd', petObj);

    if(petObj.isAlive){
      return {
        ...state,
        id: petObj.id,
        isAlive: true
      }
    }else{
      return {
        ...state,
        id: petObj.id,
        isAlive: false,
        mood: 'DEAD',
        activity: 'DEAD'
      }
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

    return {
      ...state,
      isAlive: true,
      mood: null,
      activity: null
    }
  },

  [killPet.toString()]: (state, action) => {
    console.log(" KILL ", action.payload);
    killThisPet(action.payload);

    return {
      ...state,
      isAlive: false,
      mood: 'DEAD',
      activity: 'DEAD'
    }
  }

  
}, initialState);