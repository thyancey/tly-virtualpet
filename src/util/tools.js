
import queryString from 'query-string';

export const round = (number, pad) => {
  if(!pad) return Math.round(number);
  
  const rounder = Math.pow(10, pad);
  return Math.round(number * rounder) / rounder;
}

export const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
}

export const randBetween = range => {
  return range[0] + (Math.random() * (range[1] - range[0]));
}

export const isObj = obj => {
  return typeof obj === 'object' && obj !== null;
}

export const convertStringsToNumbersInDeepObj = parsedObj => {
  let retObj = {};
  for(let key in parsedObj){
    const parsedValue = parsedObj[key];
    if(isObj(parsedValue)){
      retObj[key] = convertStringsToNumbersInDeepObj(parsedValue);
    }else{
      if(!isNaN(parsedValue)){
        retObj[key] = Number(parsedValue);
      }else{
        retObj[key] = parsedValue;
      }
    }
  }
  
  return retObj;
}

/*
  given: 
  ('pickle', 'longer-prefix/', {
    items: {
      item2:{
        pickle: "short.jpg"
      }
      pickle: 4
    }
  })

  returns: 
  {
    items: {
      item2:{
        pickle: "longer-prefix/short.jpg"
      },
      pickle: "longer-prefix/4"
    }
  }
*/

export const prefixValueInDeepObj = (prefixKey, prefixValue, parsedObj) => {
  let retObj = {};
  for(let key in parsedObj){
    const parsedValue = parsedObj[key];
    if(isObj(parsedValue)){
      retObj[key] = prefixValueInDeepObj(prefixKey, prefixValue, parsedValue);
    }else{
      if(key === prefixKey){
        retObj[key] = `${prefixValue}${parsedValue}`;
      }else{
        retObj[key] = parsedValue;
      }
    }
  }
  
  return retObj;
}

export const setObjToCookie = (cookieName, obj) => {
  let cookieValue = '';
  try{
    if(obj){
      cookieValue = JSON.stringify(obj);
    }
  }catch(e){
    console.error('Problem stringifying obj', obj);
  }
  setCookie(cookieName, cookieValue);
}

export const getCookieObj = cookieName => {
  const cookieString = getCookie(cookieName);
  if(cookieString){
    try{
      return JSON.parse(cookieString);
    }catch(e){
      console.error('Problem parsing cookieString', cookieString);
      return null;
    }
  }else{
    return null;
  }
}

export const setCookie = (cname, cvalue, expires) => {
  var d = new Date();
  d.setTime(d.getTime() + (expires || 3000000000000));
  expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export const getCookie = (cname) => {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export const deleteCookie = cname => {
  setCookie(cname, '', 1);
}

export const getSearchObj = (searchString) => {
  return queryString.parse(searchString);
}

export const updateAndGetNewQueryString = (key, value, search) => {
  const queryObj = queryString.parse(search);
  queryObj[key] = value;
  return `?${queryString.stringify(queryObj)}`;
}


//- https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
export const changeQueryObj = (key, value, searchString) => {
  if (window.history.pushState) {
    const newQueryString = updateAndGetNewQueryString(key, value, searchString);
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + newQueryString;
    window.history.pushState({path:newurl},'',newurl);
  }
}





export const VALID_CONDITIONS = [ '=', '<', '<=', '>', '>=' ];

export const evaluateExpression = (condition, criteria, value) => {
  if(VALID_CONDITIONS.indexOf(condition) === -1){
    console.error(`evaluateExpression(): invalid condition "${condition}" from valueString "${value}"`);
    return false;
  }

  // console.log('evaluateExpression()', condition, value, criteria);

  switch(condition){
    case '=':
      return value === criteria;
    case '<':
      return value < criteria;
    case '<=':
      return value <= criteria;
    case '>':
      return value > criteria;
    case '>=':
      return value >= criteria;
    default: return false;
  }
}

export const getConditionDirection = condition => {
  switch(condition){
    case '=':
      return 0;
    case '<':
      return -1;
    case '<=':
      return -1;
    case '>':
      return 1;
    case '>=':
      return 1;
    default: return 0;
  }
}

/*
  //- convert <=_20% into:
  {
    condition: '<=',
    criteria: '20',
    isPercent: true
  }
*/
export const parseExpressionString = expressionString => {
  const valueTokens = expressionString.split('_');
  const condition = valueTokens[0];
  const valueCriteria = valueTokens[1];

  const percentageSplit = valueCriteria.split('%');
  let criteria = percentageSplit[0];


  return {
    condition: condition,
    criteria: Number(criteria),
    isPercent: percentageSplit.length > 1,
    direction: getConditionDirection(condition)
  }
}

export const evaluateCondition = (expressionString, statValue) => {
  const expression = parseExpressionString(expressionString);

  let checkValue;
  if(expression.isPercent){
    checkValue = statValue.percent;
  }else{
    checkValue = statValue.cur;
  }

  if(!expression.condition){
    console.error('evaluateSet(), condition is not defined! ', expressionString);
  }
  const expressionResult = evaluateExpression(expression.condition, expression.criteria, checkValue);
  // console.log('foundExpression:', expressionString, expressionResult);
  return expressionResult;
}