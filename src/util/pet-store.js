/* simple data handler for all the pre-parsed pet information that doesnt change */
import { clamp, getCookieObj, setObjToCookie, deleteCookie, convertStringsToNumbersInDeepObj } from './tools';

const SAVE_SCHEMA_VERSION = 5;

export const DEFAULT_PERSONALITY = {
  "thinkRange": [ 200, 2000 ],
  "doRange": [ 200, 2000 ],
  "jumpChance": 0.01,
  "jumpForce": 0.8
}

const store = {
  pets:[],
  taxonomy: []
}

export const getPets = () => {
  return store.pets;
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

export const addToTaxonomy = (petDef, taxonomy) => {
  let foundTypeIndex = taxonomy.findIndex(t => t.type === petDef.type);
  if(foundTypeIndex > -1){
    const foundType = taxonomy[foundTypeIndex];
    foundType.pets.push({ id: petDef.id, label: petDef.name });
    taxonomy[foundTypeIndex] = foundType;
  }else{
    taxonomy.push({
      type: petDef.type,
      pets:[ { id: petDef.id, label: petDef.name }]
    });
  }

  return taxonomy;
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

export const setFromPetManifest = (id, petData, manifest) => {
  // console.log('setFromManifest', id);
  const savedData = getSavedData();
  const savedPet = savedData.pets.find(savedPet => savedPet.id === id);
  const petDef = parsePetData(id, petData, savedPet, savedData, manifest);
  setPetDefinition(id, petDef);

  store.taxonomy = addToTaxonomy(petDef, store.taxonomy);
}

const parseStatEvents = statEvents => {
  return statEvents.map((sE, idx) => {
    let retObj = {
      id: sE.id,
      label: sE.label,
      type: sE.type || 'event',
      cooldown: sE.cooldown ? parseInt(sE.cooldown) : 0,
      statEffects: sE.statEffects.map(sEff => convertStringsToNumbersInDeepObj(sEff))
    }

    return retObj;    
  })
}

export const parsePetData = (id, petDef, savedPet, savedData, manifest) => {
  let defaultBehavior = petDef.behaviors.DEFAULT;
  if(!defaultBehavior){
    try{
      defaultBehavior = petDef.behaviors[Object.keys(petDef.behaviors)[0]];
    }catch(e){
      console.error(`could not autodeclare default status for pet "${id}"`);
    }
  }

  const moodSwings = parseMoodSwings(petDef.moodSwings);
  const statEvents = parseStatEvents(petDef.statEvents || []);

  const definedStats = petDef.stats;
  let initialStats = [];

  /* if cookie stats, use them here instead */
  if(savedPet){
    initialStats = mergeStats(definedStats, savedPet.stats, true);
    petDef.isAlive = savedPet.isAlive;
  }else{
    initialStats = definedStats;
    petDef.isAlive = true;
  }

  petDef.stats_saved = {
    timestamp: savedData.timestamp || new Date().getTime(),
    isAlive: savedData.isAlive,
    stats: initialStats.map(s => formatSavedStatObj(s))
  }
  console.log('personality', petDef.personality)

  petDef.personality = { ...DEFAULT_PERSONALITY, ...petDef.personality };

  return {
    ...petDef,
    id: id,
    dir: manifest.url,
    behaviors:{
      ...petDef.behaviors,
      DEFAULT: defaultBehavior
    },
    moodSwings:moodSwings,
    statEvents: statEvents
  }
}

export const setPetDefinition = (petId, petDef, saveAfter) => {
  const petIdx = store.pets.findIndex(p => p.id === petId);
  if(petIdx > -1){
    store.pets[petIdx] = petDef;
  }else{
    store.pets.push(petDef);
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

export const getSavedData = () => {
  let savedData = getCookieObj('tly_virtualpet');
  if(savedData && (!savedData.schemaVersion || savedData.schemaVersion < SAVE_SCHEMA_VERSION)){
    console.warn(`Schema version ${savedData.schemaVersion} is behind version ${SAVE_SCHEMA_VERSION}, resetting all your data, sorry bubs`);
    deleteCookie('tly_virtualpet');
    savedData = null;
  }

  return savedData || getDefaultSavedData();
}

const mergeStats = (origArray, newArray, overwrite) => {
  const retArray = origArray.slice(0);
  for(let i = 0; i < newArray.length; i++){
    const newStat = newArray[i];
    const matchingStatIdx = retArray.findIndex(oStat => oStat.id === newStat.id);
    if(matchingStatIdx > -1){
      if(overwrite){
        retArray[matchingStatIdx] = { ...retArray[matchingStatIdx], ...newStat };
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

export const getStartStats = petId => {
  const petDef = getPetDefinition(petId);
  return petDef?.startStats || [];
}

export const getStartStat = (petId, statId) => {
  const startStats = getStartStats(petId);
  return startStats.find(stat => stat.id === statId) || null;
}

export const getStatRules = (petId) => {
  const petDef = getPetDefinition(petId);
  if(!petDef) return [];

  return petDef.stats.map(s => ({
    doesKill: s.doesKill || false,
    fullIsGood: s.fullIsGood,
    max: s.max,
    moods: s.moods || []
  }));
}


export const fancyUpSavedStats = (initialStats, savedStats, timestamp) => {
  const mergedStats = initialStats.map(iS => {
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
  const mergedStats = fancyUpSavedStats(petDef.stats, petDef.stats_saved, timestamp)

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
      moods: s.moods
    }
  });
}

export const killThisPet = petId => {
  console.log('KILL THIS PET ', petId)
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
  console.log(`resetting pet "${petId}"`);

  const now = new Date().getTime();
  const petDef = getPetDefinition(petId);
  const definedStats = petDef.stats;

  petDef.isAlive = true;
  petDef.stats_saved = {
    timestamp: now,
    isAlive: true,
    stats: definedStats.map(s => formatSavedStatObj(s))
  }
  setPetDefinition(petId, petDef)
}

export const deleteAllData = () => {
  store.pets = [];
  deleteCookie('tly_virtualpet');
  global.location.reload();
}


global.petStore = {
  getAllData: () => store,
  deleteAllData: () => deleteAllData(),
  getSavedData: () => getSavedData(),
  getPets: () => getPets(),
  getPetStoreData: (itemType) => getPetStoreData(itemType),
  getPetDefinition: (id) => getPetDefinition(id),
  getPetDeltaStats: (petId, timestamp) => getPetDeltaStats(petId, timestamp)
}


export default store;