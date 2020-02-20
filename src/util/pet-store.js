/* simple data handler for all the pre-parsed pet information that doesnt change */


const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
}

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

export const setPetDefinitions = petList => {
  store.pets = petList.map(p => {
    let defaultAnimation = p.animations.DEFAULT;
    if(!defaultAnimation){
      try{
        defaultAnimation = p.animations[Object.keys(p.animations)[0]];
      }catch(e){
        console.error(`could not autodeclare default animation for pet "${p.id}"`);
      }
    }

    const parsedVitals = p.vitals.map(v => ({
      ...v,
      value: Number(v.value),
      perSecond: Number(v.perSecond),
      max: Number(v.max)
    }))

    p.savedStats = {
      timestamp: new Date().getTime(),
      stats: parsedVitals
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

export const setPetStoreData = (itemType, data) => {
  return store[itemType] = data;
}
export const getPetStoreData = (itemType) => {
  return store[itemType];
}

export const setSpriteDefinitions = spriteList => {
  store.sprites = spriteList;
}

export const getPetVitals = petId => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.vitals || [];
}

export const getPetVital = (petId, vitalId) => {
  const vitals = getPetVitals(petId);
  return vitals.find(v => v.id === vitalId) || null;
}

export const getBaseStats = (petId) => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.baseStats || null;
}
export const getSavedStats = (petId) => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.stats || null;
}
export const getDeltaStats = (petId, timestamp) => {
  const petDef = getPetDefinition(petId);
  const oldStats = petDef.savedStats.stats || [];
  const timeDiff = (timestamp - petDef.savedStats.timestamp) / 1000;

  return oldStats.map(s => ({
    ...s,
    value: s.value,
    max: s.max,
    current: clamp(s.value + (s.perSecond * timeDiff), 0, s.max)
  }));
}
export const saveStats = (petId, stats, timestamp) => {
  const petDef = getPetDefinition(petId);
  petDef.savedStats = {
    timestamp: timestamp,
    stats: stats.map(s => ({ ...s, value: s.current }))
  }
  setPetDefinition(petId, petDef);
}
export const augmentPetStat = (petId, statId, augmentValue) => {
  const now = new Date().getTime();
  const stats = getDeltaStats(petId, now).slice(0);
  // console.log('deltaStats', stats[0].value)

  const idx = stats.findIndex(s => s.id === statId);
  const newValue = stats[idx].current + augmentValue;
  stats[idx].current = clamp(newValue, 0, stats[idx].max);

  // console.log('saving stats ', stats)
  saveStats(petId, stats, now);
}

global.petStore = {
  getAllData: () => store,
  getPets: () => getPets(),
  getPetStoreData: (itemType) => getPetStoreData(itemType),
  getDeltaStats: (petId, timestamp) => getDeltaStats(petId, timestamp)
}


export default store;