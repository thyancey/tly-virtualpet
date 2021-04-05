/* simple data handler for all the pre-parsed pet information that doesnt change */
import { convertStringsToNumbersInDeepObj, prefixValueInDeepObj } from './tools';

const store = {
  items:[],
  scenes:[]
}

export const setFromSceneManifest = (data, manifest) => {
  // console.log('setFromSceneManifest', data, manifest);
  // const converted = convertStringsToNumbersInDeepObj(data);
  const complete = prefixValueInDeepObj('imageUrl', `${manifest.url}/assets/`, data);
  addSceneDefinition(complete);
}
export const addSceneDefinition = (newDefinition) => {
  // console.log('adding new scene definition', newDefinition);
  store.scenes.push(newDefinition);
}
export const getSceneDefinition = id => {
  return store.scenes.find(p => p.id === id) || null;
}

export const setFromItemManifest = (data, manifest) => {
  // console.log('setFromItemManifest', data, manifest);
  // const converted = convertStringsToNumbersInDeepObj(data);
  const complete = prefixValueInDeepObj('imageUrl', `${manifest.url}/assets/`, data);
  addItemDefinition(complete);
}
export const addItemDefinition = (newDefinition) => {
  // console.log('adding new item definition', newDefinition);
  store.items.push(newDefinition);
}
export const getItemDefinition = id => {
  return store.items.find(p => p.id === id) || null;
}
export const getItems = () => {
  return store.items;
}
export const getScenes = () => {
  return store.scenes;
}

global.itemStore = {
  getAllData: () => store,
  getItems: () => getItems(),
  getScenes: () => getScenes(),
  getSceneDefinition: (id) => getSceneDefinition(id)
}


export default store;