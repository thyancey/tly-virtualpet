import { 
  setOtherData,
  setManifest,
  storeManifestItem,
  setActivePetType,
  setActivePetId,
  ping
} from '../actions';
import { setTransition } from '../actions/transition';

import { handleActions } from 'redux-actions';
import { getPetDefinition, setFromPetManifest } from 'util/pet-store';
import { setSceneDefinitions, setStyleDefinitions, setItemDefinitions } from 'util/item-store';

//- customData in store is from an external json file at public/data.json
const VALID_KEYS = [ 'pets' ];
const RESTRICT_KEYS = false;

const REQUIRED_EXTRAS = [ 'items', 'scenes' ];
 
const initialState = {
  loaded: false,
  extrasLoaded: 0,
  loadingComplete: false,
  title: 'loading',
  customData: null,
  counter: 0,
  activePetType: null,
  activePetId: null,
  ping: 0,
  manifest:{},
  manifestLoadComplete: false,
  nextManifestItem: null
}

export default handleActions({
  [setManifest.toString()]: (state, action) => {
    const cleanManifestObj = {};
    const parsedData = action.payload;
    for(let key in parsedData){
      if(VALID_KEYS.indexOf(key) === -1){
        console.warn(`key supplied in /data.json "${key}" is not a valid key`);
        if(!RESTRICT_KEYS) cleanManifestObj[key] = parsedData[key];
      }
      else{
        cleanManifestObj[key] = parsedData[key];
      }
    }

    const manifestNext = cleanManifestObj.pets && cleanManifestObj.pets[0];
    let nextManifestItem = null;
    if(manifestNext){
      nextManifestItem = {
        type: 'pets',
        idx: 0,
        id: manifestNext.id,
        url: manifestNext.url
      }
    }

    return {
      ...state,
      manifest: cleanManifestObj,
      nextManifestItem: nextManifestItem,
      loaded: true
    }
  },

  [storeManifestItem.toString()]: (state, action) => {
    const { manifest, data} = action.payload;
    
    if(manifest.type === 'pets'){
      setFromPetManifest(data, manifest)
    }

    const nextManifestIdx = manifest.idx + 1;
    const manifestNext = state.manifest.pets[nextManifestIdx] || null;

    if(manifestNext){
      return {
        ...state,
        nextManifestItem: {
          type: 'pets',
          idx: nextManifestIdx,
          id: manifestNext.id,
          url: manifestNext.url
        },
        manifestLoadComplete: false
      }

    }else{
      console.log('-------------------------');
      console.log('All manifest items loaded.');
      return {
        ...state,
        nextManifestItem: null,
        manifestLoadComplete: true
      }
    }
  },

  [setOtherData.toString()]: (state, action) => {
    let extrasLoaded = state.extrasLoaded;
    console.log(`setOtherData: "${action.payload.type}"`);

    if(REQUIRED_EXTRAS.indexOf(action.payload.type) > -1){
      extrasLoaded += 1;
    }
    
    if(action.payload.type === 'scenes'){
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
    console.log('setActivePetType', action.payload)
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
