import { 
  setActivePetId
} from '../actions';
import { 
  addActivity,
  removeActivity,
  forceBehavior,
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
  forcedBehavior: null,
  activities: []
};

export default handleActions({
  [setActivePetId.toString()]: (state, action) => {
    const petObj = getPetDefinition(action.payload);
    //- get stats, etc

    //- update the route
    if(petObj){
      changeQueryObj('pet', petObj.id, global.location.search);
      // const found = allPets.find(p => p.id === activePetId);
  
      if(petObj.isAlive){
        return {
          ...state,
          id: petObj.id,
          isAlive: true,
          activities: [],
          mood: null
        }
      }else{
        return {
          ...state,
          id: petObj.id,
          isAlive: false,
          activities: [],
          mood: 'DEAD'
        }
      }
    }else{
      return state;
    }
  },

  [augmentStat.toString()]: (state, action) => {
    augmentPetStat(state.id, action.payload.id, action.payload.value);
    return state;
  },

  [addActivity.toString()]: (state, action) => {
    const activity = action.payload;
    // console.log('addActivity > ', activity);

    if(state.activities.indexOf(activity) > -1){
      return state;
    }else{
      return {
        ...state,
        activities: [ ...state.activities, activity ]
      } 
    }
  },

  [removeActivity.toString()]: (state, action) => {
    const activity = action.payload;
    // console.error('removeActivity < ', activity);
    
    return {
      ...state,
      activities: state.activities.filter(a => a !== activity)
    }
  },

  [forceBehavior.toString()]: (state, action) => {
    const newBehavior = state.forcedBehavior !== action.payload ? action.payload : null;
    return {
      ...state,
      forcedBehavior: newBehavior
    }
  },

  [resetPet.toString()]: (state, action) => {
    const petId = action.payload;

    resetPetState(petId);

    return {
      ...state,
      isAlive: true,
      mood: null,
      activities: []
    }
  },

  [killPet.toString()]: (state, action) => {
    console.log(" KILL ", action.payload);
    killThisPet(action.payload);

    return {
      ...state,
      isAlive: false,
      mood: 'DEAD',
      activities: []
    }
  }

  
}, initialState);