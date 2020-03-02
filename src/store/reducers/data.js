import { 
  setCustomData,
  setOtherData,
  setActivePetType,
  setActivePetId,
  ping
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';
import { setPetDefinitions, setSpriteDefinitions, getPetDefinition } from 'util/pet-store';
import { setSceneDefinitions, setStyleDefinitions, setItemDefinitions } from 'util/item-store';

//- customData in store is from an external json file at public/data.json
const VALID_KEYS = [ 'customTitle', 'customValue', 'customArray', 'customObjects' ];
const RESTRICT_KEYS = false;

const REQUIRED_EXTRAS = [ 'pets', 'items', 'scenes' ];
 
const initialState = {
  loaded: false,
  extrasLoaded: 0,
  loadingComplete: false,
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
    // console.log('setCustomData', action.payload);
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
    let extrasLoaded = state.extrasLoaded;

    if(REQUIRED_EXTRAS.indexOf(action.payload.type) > -1){
      extrasLoaded += 1;
    }
    
    if(action.payload.type === 'pets'){
      setPetDefinitions(action.payload.data.pets);
      setSpriteDefinitions(action.payload.data.sprites);
    } else if(action.payload.type === 'scenes'){
      setStyleDefinitions(action.payload.data.styles || []);
      setSceneDefinitions(action.payload.data.scenes || []);
    } else if(action.payload.type === 'items'){
      setItemDefinitions(action.payload.data.items || []);
    }

    return {
      ...state,
      extrasLoaded: extrasLoaded,
      loadingComplete: extrasLoaded === REQUIRED_EXTRAS.length
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
    //- pet existssetPetDefinitions
    const petDef = getPetDefinition(action.payload);
    if(petDef){
      return {
        ...state,
        activePetId: action.payload
      }
    }else{
      console.error(`Could not get pet definition for id "${action.payload}"`);
      return {
        ...state
      }
    }
  },

  [ping.toString()]: (state) => {
    return {
      ...state,
      ping: state.ping + 1
    }
  },
}, initialState);
