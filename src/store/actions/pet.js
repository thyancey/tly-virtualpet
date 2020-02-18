import { createAction } from 'redux-actions';

export const incrementXp = createAction('INCREMENT_XP');
export const incrementFood = createAction('INCREMENT_FOOD');
export const incrementHappy = createAction('INCREMENT_HAPPY');
export const incrementBladder = createAction('INCREMENT_BLADDER');
export const setMood = createAction('SET_MOOD');
export const setActivity = createAction('SET_ACTIVITY');