import { createAction } from 'redux-actions';


export const setCustomData = createAction('SET_CUSTOM_DATA');
export const setActivePetType = createAction('SET_ACTIVE_PET_TYPE');
export const setActivePetId = createAction('SET_ACTIVE_PET_ID');
export const incrementCounter = createAction('INCREMENT_COUNTER');
export const decrementCounter = createAction('DECREMENT_COUNTER');