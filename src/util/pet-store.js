/* simple data handler for all the pre-parsed pet information that doesnt change */
import { clamp, getCookieObj, setObjToCookie, deleteCookie } from './tools';

const store = {
  pets:[],
  sprites:[]
}

export const getPets = () => {
  return store.pets;
}
export const getSprites = () => {
  return store.sprites;
}

export const getPetDefinition = petId => {
  return store.pets.find(p => p.id === petId) || null;
}
export const setPetDefinition = (petId, petDef) => {
  store.pets[petId] = petDef;
}

export const formatStatObj = statObj => {
  return {
    ...statObj,
    value: Number(statObj.value),
    perSecond: Number(statObj.perSecond),
    max: Number(statObj.max)
  }
}

export const setPetDefinitions = petList => {
  //- grab cookie, if cookie, get list of saved pet stats
  const savedData = getCookieObj('tly_virtualpet') || { 
    timestamp: null, 
    pets: []
  };

  store.pets = petList.map(p => {
    let defaultAnimation = p.animations.DEFAULT;
    if(!defaultAnimation){
      try{
        defaultAnimation = p.animations[Object.keys(p.animations)[0]];
      }catch(e){
        console.error(`could not autodeclare default animation for pet "${p.id}"`);
      }
    }

    const savedPet = savedData.pets.find(savedPet => savedPet.id === p.id);
    const definedStats = p.stats_initial.stats.map(stat => formatStatObj(stat));
    let initialStats = [];

    /* if cookie stats, use them here instead */
    if(savedPet){
      initialStats = mergeStats(definedStats, savedPet.stats, true);
    }else{
      initialStats = definedStats;
    }

    p.stats_saved = {
      timestamp: savedData.timestamp || new Date().getTime(),
      stats: initialStats
    }

    return {
      ...p,
      animations:{
        ...p.animations,
        DEFAULT: defaultAnimation
      }
    }
  });
}

const mergeStats = (origArray, newArray, overwrite) => {
  const retArray = origArray.slice(0);
  for(let i = 0; i < newArray.length; i++){
    const newStat = newArray[i];
    const matchingStatIdx = retArray.findIndex(oStat => oStat.id === newStat.id);
    if(matchingStatIdx > -1){
      if(overwrite){
        retArray[matchingStatIdx] = newStat;
      }else{
        //- not unique, dont add it
      }
    }else{
      retArray.push(newStat);
    }
  }

  return retArray;
}

export const setPetStoreData = (itemType, data) => {
  return store[itemType] = data;
}
export const getPetStoreData = (itemType) => {
  return store[itemType];
}

export const setSpriteDefinitions = spriteList => {
  store.sprites = spriteList;
}

export const getStartStats = petId => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.startStats || [];
}

export const getStartStat = (petId, statId) => {
  const startStats = getStartStats(petId);
  return startStats.find(stat => stat.id === statId) || null;
}

export const getStatRules = (petId) => {
  const petDef = getPetDefinition(petId);
  if(!petDef) return [];

  return petDef.stats_initial.stats.map(s => ({
    fullIsGood: s.fullIsGood,
    max: s.max
  }));
}

export const getPetDeltaStats = (petId, timestamp) => {
  // console.log('getPetDeltaStats', petId, timestamp)
  const petDef = getPetDefinition(petId);

  return getDeltaStats(petDef.stats_saved, timestamp);
}

export const getDeltaStats = (statsObj, timestamp) =>{
  const oldStats = statsObj.stats || [];
  const timeDiff = (timestamp - statsObj.timestamp) / 1000;

  return oldStats.map(s => ({
    ...s,
    value: s.value,
    max: s.max,
    current: clamp(s.value + (s.perSecond * timeDiff), 0, s.max)
  }));
}





export const augmentPetStat = (petId, statId, augmentValue) => {
  const now = new Date().getTime();
  const stats = getPetDeltaStats(petId, now).slice(0);
  const idx = stats.findIndex(s => s.id === statId);
  const newValue = stats[idx].current + augmentValue;
  stats[idx].current = clamp(newValue, 0, stats[idx].max);

  saveStats(petId, stats, now);
}





/* SAVING */
export const saveStats = (petId, stats, timestamp) => {
  const petDef = getPetDefinition(petId);
  petDef.stats_saved = {
    timestamp: timestamp,
    stats: stats.map(s => ({ ...s, value: s.current }))
  }
  setPetDefinition(petId, petDef);
  saveAllPetStatsToCookie();
}

export const saveAllPetStatsToCookie = () => {
  console.log('saveAllPetStatsToCookie')
  setObjToCookie('tly_virtualpet', {
    timestamp: new Date().getTime(),
    pets: store.pets.map(p => ({
      ...p.stats_saved,
      id: p.id
    }))
  });
}


export const saveAllPetStatsToCookieNow = () => {
  store.pets.forEach(p => {

    const now = new Date().getTime();
    const stats = getPetDeltaStats(p.id, now).slice(0);

    p.stats_saved = {
      timestamp: now,
      stats: stats.map(s => ({ ...s, value: s.current }))
    }
    setPetDefinition(p.id, p);
  });

  saveAllPetStatsToCookie();
}



/* RESETTING */
export const resetPetState = petId => {
  const petDef = getPetDefinition(petId);
  const definedStats = petDef.stats_initial.stats.map(stat => formatStatObj(stat));

  const now = new Date().getTime();
  const statsObj = getDeltaStats({
    timestamp: now,
    stats: definedStats
  }, now);

  saveStats(petId, statsObj, new Date().getTime());
}

export const deleteAllData = () => {
  store.pets = [];
  deleteCookie('tly_virtualpet');
  global.location.reload();
}


global.petStore = {
  getAllData: () => store,
  getPets: () => getPets(),
  getPetStoreData: (itemType) => getPetStoreData(itemType),
  getPetDeltaStats: (petId, timestamp) => getPetDeltaStats(petId, timestamp)
}


export default store;