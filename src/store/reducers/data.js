import { 
  setCustomData,
  setOtherData,
  setActivePetType,
  setActivePetId,
  ping
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';
import { setPetDefinitions, setSpriteDefinitions } from 'util/pet-store';
import { setSceneDefinitions, setItemDefinitions } from 'util/item-store';

//- customData in store is from an external json file at public/data.json
const VALID_KEYS = [ 'customTitle', 'customValue', 'customArray', 'customObjects' ];
const RESTRICT_KEYS = false;
 
const initialState = {
  loaded: false,
  title: 'loading',
  customData: null,
  counter: 0,
  activePetType: null,
  activePetId: null,
  ping: 0
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

  [setOtherData.toString()]: (state, action) => {
    
    if(action.payload.type === 'pets'){
      setPetDefinitions(action.payload.data.pets);
      setSpriteDefinitions(action.payload.data.sprites);
      
      return {
        ...state,
        petsLoaded: true
      }
    } else if(action.payload.type === 'items'){
      setSceneDefinitions(action.payload.data.scenes || []);
      setItemDefinitions(action.payload.data.items || []);
      
      return {
        ...state,
        petsLoaded: true
      }
    } else{
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
  },

  [ping.toString()]: (state) => {
    return {
      ...state,
      ping: state.ping + 1
    }
  },
}, initialState);
