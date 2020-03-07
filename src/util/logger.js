
const store = {
  entries:[-1],  
  level:0,
  logIdx:-1,
};

export const init = (logLevel) => {
  store.entries = [];
  store.level = logLevel || 0;
  store.logIdx = -1;
}

export const output = (logArgs, level) => {
  if(level === -1) level = store.logLevel;

  //- if level is 'error' then..
  console.log(...logArgs)
}

export const send = (...args) => {
  store.entries.push(args);
  store.logIdx = store.entries.length - 1;
  
  log();
}

export const sendQuiet = (...args) => {
  store.entries.push(args);
  store.logIdx = store.entries.length - 1;
}

export const log = () => {
  output(store.entries[store.logIdx], store.level);
}

export const logPrevious = () => {
  if(store.length === 0 || store.logIdx === -1) {
    return;
  }else if(store.length === 1 || store.logIdx === 0){
    output(store.entries[store.logIdx], store.level);
  }else{
    store.logIdx--;
    output(store.entries[store.logIdx], store.level);
  }
}

export const logNext = () => {
  if(store.logIdx === store.entries.length - 1){
    output(store.entries[store.logIdx], store.level);
  }else{
    store.logIdx++;
    output(store.entries[store.logIdx], store.level);
  }
}

export const logLast = () => {
  store.logIdx = store.entries.length - 1;
  if(store.logIdx > -1){
    console.log('idx', store.logIdx)
    output(store.entries[store.logIdx], store.level);
  }
}

export default {
  init: init,
  send: send,
  sendQuiet: sendQuiet,
  output: output,
  log: log,
  logNext: logNext,
  logPrevious: logPrevious,
  logLast: logLast
}