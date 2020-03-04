/* simple data handler for all the pre-parsed pet information that doesnt change */
import { clamp, getCookieObj, setObjToCookie, deleteCookie } from './tools';
import { parse } from 'query-string';

const SAVE_SCHEMA_VERSION = 3;

const store = {
  pets:[],
  sprites:[],
  taxonomy: []
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

/*
TAXONOMY EXAMPLE
allTypes: [
  {
    type: 'wildlife',
    pets: [
      {
        id:'wildlife-billybeaver',
        label:'Billy the Beaver'
      }
    ]
  }
]
*/

export const getTaxonomy = () => {
  return store.taxonomy;
}

//- right now this doesnt need to be dynamic, so its run on load one time and stored to easy access variable
export const gatherTaxonomy = (pets) => {
  let allPetTypes = [];
  pets.forEach(p => {
    let foundTypeIndex = allPetTypes.findIndex(t => t.type === p.type);
    if(foundTypeIndex > -1){
      const foundType = allPetTypes[foundTypeIndex];
      foundType.pets.push({ id: p.id, label: p.name });

      allPetTypes[foundTypeIndex] = foundType;
    }else{
      allPetTypes.push({
        type: p.type,
        pets:[]
      });
    }
  });

  return allPetTypes;
}

export const getPetTypes = () => {

  let allPetTypes = [];
  store.pets.forEach(p => {
    let foundTypeIndex = allPetTypes.findIndex(t => t.type === p.type);
    if(foundTypeIndex > -1){
      const foundType = allPetTypes[foundTypeIndex];
      foundType.pets.push({ id: p.id, label: p.name });

      allPetTypes[foundTypeIndex] = foundType;
    }else{
      allPetTypes.push({
        type: p.type,
        pets:[]
      });
    }
  });

  return allPetTypes;
}


export const setPetDefinition = (petId, petDef, saveAfter) => {
  const petIdx = store.pets.findIndex(p => p.id === petId);
  if(petIdx > -1){
    store.pets[petIdx] = petDef;
  }else{
    store.pets.push = petDef;
  }

  if(saveAfter)  saveAllPetStatsToCookie();
}

export const formatStatObj = statObj => {
  return {
    ...statObj,
    value: Number(statObj.value),
    perSecond: Number(statObj.perSecond),
    max: Number(statObj.max)
  }
}

export const getDefaultSavedData = () => ({ 
  schemaVersion: SAVE_SCHEMA_VERSION,
  timestamp: null, 
  pets: []
});

export const parseMoodSwings = (moodSwings) => {
  return moodSwings || [];
}


export const setPetDefinitions = petList => {
  //- grab cookie, if cookie, get list of saved pet stats
  let savedData = getCookieObj('tly_virtualpet');
  if(savedData && (!savedData.schemaVersion || savedData.schemaVersion < SAVE_SCHEMA_VERSION)){
    console.warn(`Schema version ${savedData.schemaVersion} is behind version ${SAVE_SCHEMA_VERSION}, resetting all your data, sorry bubs`);
    deleteCookie('tly_virtualpet');
    savedData = null;
  }
  

  if(!savedData){
    savedData = getDefaultSavedData();
  }


  store.pets = petList.map(p => {
    let defaultStatus = p.statuses.DEFAULT;
    if(!defaultStatus){
      try{
        defaultStatus = p.statuses[Object.keys(p.statuses)[0]];
      }catch(e){
        console.error(`could not autodeclare default status for pet "${p.id}"`);
      }
    }

    const moodSwings = parseMoodSwings(p.moodSwings);

    const savedPet = savedData.pets.find(savedPet => savedPet.id === p.id);
    const definedStats = p.stats_initial.stats;
    let initialStats = [];

    /* if cookie stats, use them here instead */
    if(savedPet){
      initialStats = mergeStats(definedStats, savedPet.stats, true);
      p.isAlive = savedPet.isAlive;
    }else{
      initialStats = definedStats;
      p.isAlive = true;
    }

    p.stats_saved = {
      timestamp: savedData.timestamp || new Date().getTime(),
      isAlive: savedData.isAlive,
      stats: initialStats.map(s => formatSavedStatObj(s))
    }
    setPetDefinition(p.id, p);

    return {
      ...p,
      statuses:{
        ...p.statuses,
        DEFAULT: defaultStatus
      },
      moodSwings:moodSwings
    }
  });

  store.taxonomy = gatherTaxonomy(store.pets);
}

const mergeStats = (origArray, newArray, overwrite) => {
  const retArray = origArray.slice(0);
  for(let i = 0; i < newArray.length; i++){
    const newStat = newArray[i];
    const matchingStatIdx = retArray.findIndex(oStat => oStat.id === newStat.id);
    if(matchingStatIdx > -1){
      if(overwrite){
        retArray[matchingStatIdx] = { ... retArray[matchingStatIdx], ...newStat };
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
    doesKill: s.doesKill || false,
    fullIsGood: s.fullIsGood,
    max: s.max,
    modifiers: s.modifiers || []
  }));
}


export const fancyUpSavedStats = (initialStats, savedStats, timestamp) => {
  const mergedStats = initialStats.stats.map(iS => {
    const savedStat = savedStats.stats.find(sS => sS.id === iS.id);
    return {...iS, ...savedStat}
  });


  return {
    timestamp: savedStats.timestamp || timestamp,
    stats: mergedStats.map(mS => formatStatObj(mS))
  }


}

export const getPetDeltaStats = (petId, timestamp) => {
  const petDef = getPetDefinition(petId);
  const mergedStats = fancyUpSavedStats(petDef.stats_initial, petDef.stats_saved, timestamp)

  return getDeltaStats(mergedStats, timestamp);
}

export const getDeltaStats = (statsObj, timestamp) =>{
  const oldStats = statsObj.stats || [];
  const timeDiff = (timestamp - statsObj.timestamp) / 1000;

  return oldStats.map(s => {
    return {
      ...s,
      value: s.value,
      max: s.max,
      current: Math.round(clamp(s.value + (s.perSecond * timeDiff), 0, s.max)),
      modifiers: s.modifiers
    }
  });
}

export const killThisPet = petId => {
  console.error('KILL THIS PET ', petId)
  const petDef = getPetDefinition(petId);
  petDef.isAlive = false;
  setPetDefinition(petId, petDef, true);
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
  // console.log('SAVING', petId, timestamp);
  const petDef = getPetDefinition(petId);
  // console.log(petDef)
  // console.error('saving isAlive as ', petDef.isAlive)
  petDef.stats_saved = {
    timestamp: timestamp,
    isAlive: petDef.isAlive,
    stats: stats.map(s => (formatSavedStatObj({ ...s, value: s.current})))
  }
  setPetDefinition(petId, petDef, true);
}

export const saveAllPetStatsToCookie = () => {
  console.log('saveAllPetStatsToCookie');
  setObjToCookie('tly_virtualpet', {
    schemaVersion: SAVE_SCHEMA_VERSION,
    timestamp: new Date().getTime(),
    pets: store.pets.map(p => ({
      ...p.stats_saved,
      id: p.id
    }))
  });
}

export const formatSavedStatObj = stat => {

  //- TODO, only NEED to save id and value, however other stuff depends on (and shouldnt depend on) these being in the cookie

  return {
    id: stat.id,
    value: stat.value,
    type: stat.type,
    label: stat.label,
    perSecond: stat.perSecond,
    max: stat.max,
    fullIsGood: stat.fullIsGood,
    doesKill: stat.doesKill
  }
} 


export const saveAllPetStatsToCookieNow = () => {
  store.pets.forEach(p => {

    const now = new Date().getTime();
    const stats = getPetDeltaStats(p.id, now).slice(0);

    p.stats_saved = {
      timestamp: now,
      isAlive: p.isAlive,
      stats: stats.map(s => (formatSavedStatObj({ ...s, value: s.current})))
    }
    setPetDefinition(p.id, p);
  });

  saveAllPetStatsToCookie();
}



/* RESETTING */
export const resetPetState = petId => {
  const petDef = getPetDefinition(petId);
  const definedStats = petDef.stats_initial.stats;
  // const definedStats = petDef.stats_initial.stats.map(stat => formatStatObj(stat));

  petDef.isAlive = true;
  setPetDefinition(petId, petDef)

  const now = new Date().getTime();
  const statsObj = getDeltaStats({
    timestamp: now,
    isAlive: true,
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
  deleteAllData: () => deleteAllData(),
  getPets: () => getPets(),
  getPetStoreData: (itemType) => getPetStoreData(itemType),
  getPetDefinition: (id) => getPetDefinition(id),
  getPetDeltaStats: (petId, timestamp) => getPetDeltaStats(petId, timestamp)
}


export default store;