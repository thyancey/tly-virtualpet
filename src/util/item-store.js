/* simple data handler for all the pre-parsed pet information that doesnt change */
import { convertStringsToNumbersInDeepObj } from './tools';

const store = {
  items:[],
  scenes:[]
}

export const setItemDefinitions = itemList => {
  store.items = itemList.map(i => convertStringsToNumbersInDeepObj(i));
}
export const setSceneDefinitions = sceneList => {
  store.scenes = sceneList.map(i => convertStringsToNumbersInDeepObj(i));
}

export const getSceneDefinition = id => {
  return store.scenes.find(p => p.id === id) || null;
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