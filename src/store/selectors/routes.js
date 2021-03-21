
import { getSearchObj } from '@util/tools';

export const selectPetFromWindow = () => {
  console.log('selectPetFromWindow')
  const search = window.location.search;
  return selectPetFromSearchQuery(search);
}

export const selectPetFromSearchQuery = queryString => {
  console.log('selectPetFromSearchQuery', queryString)
  if(!queryString) return null;

  const obj = getSearchObj(queryString);
  return obj.pet || null;
}