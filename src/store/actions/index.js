import { createAction } from 'redux-actions';

export const setManifest = createAction('SET_MANIFEST');
export const storeManifestItem = createAction('STORE_MANIFEST_ITEM');
export const loadExternalItem = createAction('LOAD_EXTERNAL_ITEM');
export const setSettingsValue = createAction('SET_SETTINGS_VALUE');
export const setOtherData = createAction('SET_OTHER_DATA');
export const setActivePetType = createAction('SET_ACTIVE_PET_TYPE');
export const setActivePetId = createAction('SET_ACTIVE_PET_ID');
export const ping = createAction('PING');