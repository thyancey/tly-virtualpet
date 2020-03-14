import { createAction } from 'redux-actions';

export const setManifest = createAction('SET_MANIFEST');
export const setOtherData = createAction('SET_OTHER_DATA');
export const setActivePetType = createAction('SET_ACTIVE_PET_TYPE');
export const setActivePetId = createAction('SET_ACTIVE_PET_ID');
export const ping = createAction('PING');