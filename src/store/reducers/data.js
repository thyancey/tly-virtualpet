import { 
  setCustomData,
  setOtherData,
  setActivePetType,
  setActivePetId
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';
import PetStore from 'util/pet-store';
import { setPetDefinitions, setSpriteDefinitions, setGraphicDefinitions, setPetStoreData } from 'util/pet-store';

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

    // setPetDefinitions(cleanObj.pets);
    setPetStoreData('sprites', cleanObj.sprites);
    setPetStoreData('graphics', cleanObj.graphics);

    return {
      ...state,
      customData: cleanObj,
      loaded: true
    }
  },

  [setOtherData.toString()]: (state, action) => {
    setPetDefinitions(action.payload.data.pets);
    setSpriteDefinitions(action.payload.data.sprites);
    setGraphicDefinitions(action.payload.data.graphics);
    
    if(action.payload.type === 'pets'){
      
      return {
        ...state,
        petsLoaded: true
      }
    }else{
      return state
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
  }
}, initialState);
