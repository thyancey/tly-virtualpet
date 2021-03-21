
import { getSearchObj } from '@util/tools';

export const selectPetFromUrl = queryString => {
  console.log('selectPetFromUrl')
  if(!queryString) return null;

  const obj = getSearchObj(queryString);
  return obj.pet || null;
}