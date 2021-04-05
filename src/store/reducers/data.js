import { 
  setManifest,
  storeManifestItem,
  loadExternalItem,
  setActivePetType,
  setActivePetId,
  setSettingsValue,
  ping
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';

import { clamp } from '@util/tools';
import { getPetDefinition, setFromPetManifest } from '@util/pet-store';
import { setFromSceneManifest, setFromItemManifest } from '@util/item-store';
import { getNextManifestData, setManifestStages } from '@util/manifest-helper';

const VALID_KEYS = [ 'title', 'stages' ];
const RESTRICT_KEYS = false;
const DEFAULT_PING_RATE = 1000;
const DEFAULT_VOLUME = 50;
const DEFAULT_ANIMATION_SPEED = 30;
 
const initialState = {
  loadingComplete: false,
  settings:{
    pingRate: DEFAULT_PING_RATE,
    volume: DEFAULT_VOLUME,
    animationSpeed: DEFAULT_ANIMATION_SPEED
  },
  title: 'loading',
  customData: null,
  counter: 0,
  activePetType: null,
  activePetId: null,
  ping: 0,
  nextManifestItem: null,
  nextExternalItem: null
}

export default handleActions({
  [setManifest.toString()]: (state, action) => {
    const cleanManifestObj = {};
    const parsedData = action.payload;
    const customData = {};
    for(let key in parsedData){
      if(VALID_KEYS.indexOf(key) === -1){
        console.warn(`key supplied in /data.json "${key}" is not a valid key`);
        if(!RESTRICT_KEYS) cleanManifestObj[key] = parsedData[key];
      }
      else{
        cleanManifestObj[key] = parsedData[key];
        if(key !== 'stages'){
          customData[key] = parsedData[key];
        }
      }
    }

    let pingRate = state.settings.pingRate;
    if(parsedData.pingRate !== undefined){
      try {
        if(!isNaN(parsedData.pingRate)){
          pingRate = clamp(parseInt(parsedData.pingRate), 50, 5000);
        }
      }catch(e){
        console.error('there was a problem parsing pingRate');
      }
    }
    
    // console.log('----------------');
    // console.log('starting manifest');
    setManifestStages(parsedData.stages);
    const nextManifestItem = getNextManifestData(0);

    return {
      ...state,
      nextManifestItem,
      loadingComplete: nextManifestItem === null,
      settings:{
        ...state.settings,
        pingRate
      },
      customData
    }
  },

  [storeManifestItem.toString()]: (state, action) => {
    // console.log('storeManifestItem', action.payload);
    const { manifest, data } = action.payload;
    // console.log('manifestItem', manifest)
    if(manifest.type === 'pets'){
      setFromPetManifest(manifest.id, data, manifest)
    }else if(manifest.type === 'items'){
      setFromItemManifest(data, manifest);
    }else{
      setFromSceneManifest(data, manifest);
    }

    if(manifest.isExternal){
      return {
        ...state,
        nextExternalItem: null,
      }
    }else{
      const nextManifestItem = getNextManifestData(manifest.idx + 1);
      return {
        ...state,
        nextManifestItem,
        loadingComplete: nextManifestItem === null
      }
    }
  },

  [setTransition.toString()]: (state, action) => {
    return {
      ...state,
      transitionLabel: action.payload.label
    }
  },

  [loadExternalItem.toString()]: (state, action) => {
    // console.log('received ', action.payload);

    return {
      ...state,
      nextExternalItem: {
        id: action.payload.id || action.payload.url,
        idx: 0,
        type: action.payload.type,
        url: action.payload.url,
        isExternal: true
      }
    }
  },

  [setSettingsValue.toString()]: (state, action) => {
    // console.log('setSettingsValue', action.payload);
    const settingsKey = action.payload.id;
    const storedValue = state.settings[settingsKey];

    if(storedValue !== undefined && storedValue !== action.payload.value){
      return {
        ...state,
        settings: {
          ...state.settings,
          [settingsKey]: action.payload.value
        }
      }
    }else{
      return state;
    }
  },

  [setActivePetType.toString()]: (state, action) => {
    // console.log('setActivePetType', action.payload)
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
