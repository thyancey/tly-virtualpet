import { throttle } from 'throttle-debounce';

const store = {
  entries:[-1],  
  level:0,
  logIdx:-1,
  throttleActive: true
};

const DEFAULTTHROTTLE_SPEED = 500;

export const init = (logLevel, throttleSpeed = DEFAULTTHROTTLE_SPEED) => {
  store.entries = [];
  store.level = logLevel || 0;
  store.logIdx = -1;
  store.throttleSpeed = throttleSpeed;
  setThrottleSpeed(throttleSpeed);
}


export const onThrottledLog = (...args) => {
  if(store.throttleActive){
    log(args);
  }
}

export let throttledLog = throttle(DEFAULTTHROTTLE_SPEED, false, onThrottledLog);

export const pause = () => {
  if(store.throttleActive){
    log('Logger |');
    store.throttleActive = !store.throttleActive;
  }else{
    log('Logger |>');
    store.throttleActive = !store.throttleActive;
  }
}

export const setThrottleSpeed = throttleSpeed => {
  throttledLog = throttle(throttleSpeed, false, onThrottledLog);
}

export const doOutput = (logArgs, level) => {
  if(level === -1) level = store.logLevel;

  //- if level is 'error' then..
  console.log(...logArgs)
}

export const log = (...args) => {
  doOutput(args, -1);
}

export const logSave = (...args) => {
  store.entries.push(args);
  store.logIdx = store.entries.length - 1;
  
  output();
}

export const logQuiet = (...args) => {
  store.entries.push(args);
  store.logIdx = store.entries.length - 1;
}

export const output = () => {
  doOutput(store.entries[store.logIdx], store.level);
}
export const outputAll = () => {
  for (let s = 0; s < store.entries.length; s++){
    store.logIdx = s;
    output();
  };
}

export const outputPrevious = () => {
  if(store.length === 0 || store.logIdx === -1) {
    return;
  }else if(store.length === 1 || store.logIdx === 0){
    doOutput(store.entries[store.logIdx], store.level);
  }else{
    store.logIdx--;
    doOutput(store.entries[store.logIdx], store.level);
  }
}

export const outputNext = () => {
  if(store.logIdx === store.entries.length - 1){
    doOutput(store.entries[store.logIdx], store.level);
  }else{
    store.logIdx++;
    doOutput(store.entries[store.logIdx], store.level);
  }
}

export const outputLast = () => {
  store.logIdx = store.entries.length - 1;
  if(store.logIdx > -1){
    console.log('idx', store.logIdx)
    doOutput(store.entries[store.logIdx], store.level);
  }
}



const PublicInterface = {
  init: init,
  log: log,
  pause: pause,
  setThrottleSpeed: setThrottleSpeed,
  logSave: logSave,
  logQuiet: logQuiet,
  doOutput: doOutput,
  output: output,
  outputAll: outputAll,
  outputNext: outputNext,
  outputPrevious: outputPrevious,
  outputLast: outputLast,
  store: store,
  throttledLog: throttledLog
}

export default PublicInterface;