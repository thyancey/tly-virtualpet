/* simple data handler for all the pre-parsed pet information that doesnt change */
import { convertStringsToNumbersInDeepObj } from './tools';

const store = {
  items:[],
  scenes:[],
  styles: []
}

export const getDefaultStyle = () => {
  return store.styles.find(s => s.id === 'default');
}

export const setItemDefinitions = list => {
  store.items = list.map(i => convertStringsToNumbersInDeepObj(i));
}
export const setStyleDefinitions = list => {
  store.styles = list.map(i => convertStringsToNumbersInDeepObj(i));
}
export const setSceneDefinitions = list => {
  const scenes = list.map(i => convertStringsToNumbersInDeepObj(i));
  store.scenes = scenes.map(s => ({
    ...s,
    styles: getStyleDefinition(s.style)
  }))
}

export const getStyleDefinition = id => {
  return store.styles.find(p => p.id === id) || getDefaultStyle();
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