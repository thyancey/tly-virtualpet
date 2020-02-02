/* simple data handler for all the pre-parsed pet information that doesnt change */


const store = {
  pets:[],
  graphics:[],
  sprites:[]
}

export const getPets = () => {
  return store.pets;
}
export const getBaseStats = (petId) => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.baseStats || null;
}
export const getSavedStats = (petId) => {
  const petDef = getPetDefinition(petId);
  return petDef && petDef.stats || null;
}
export const getSprites = () => {
  return store.sprites;
}
export const getGraphics = () => {
  return store.graphics;
}

export const getPetDefinition = petId => {
  return store.pets.find(p => p.id === petId) || null;
}
export const setPetDefinitions = petList => {
  store.pets = petList;
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
export const setGraphicDefinitions = graphicList => {
  store.graphics = graphicList;
}

global.petStore = {
  getAllData: () => store,
  getPets: () => getPets(),
  getPetStoreData: (itemType) => getPetStoreData(itemType)
}


export default store;