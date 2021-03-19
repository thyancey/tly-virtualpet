import { INPUTS } from '../components/pet';
import { randBetween } from './tools';

export const STATUS = {
  BRAINDEAD: 0,
  THINKING: 1,
  DOING: 2
};

export const TIME_RANGE = {
  THINKING: [ 200, 2000 ],
  DOING: [ 200, 2000 ]
};

class PetBrain {
  constructor(onDoComplete, onThinkComplete) {
    this.onThinkComplete = onThinkComplete;
    this.onDoComplete = onDoComplete;

    this.timer = null;
    this.status = STATUS.BRAINDEAD;
  }

  getStatus(){
    return this.name;
  }

  pullThePlug(){
    this.status = STATUS.BRAINDEAD;
    this.killTimer();
  }

  startTimer(type, callback, timerDuration = 1000){
    this.killTimer();
    this.timer = window.setTimeout(() => {
      this.onTimerComplete(type, callback);
    }, timerDuration)
  }

  killTimer(){
    if(this.timer){
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  getDuration(statusType){
    if(statusType === STATUS.THINKING){
      return randBetween(TIME_RANGE.THINKING);
    }else if(statusType === STATUS.DOING) {
      return randBetween(TIME_RANGE.DOING);
    }else{
      console.error(`unexpected duration type "${statusType}"`);
      return 0;
    }
  }

  think(stats, inputs){
    if(inputs.length > 0){
      // right now, handled outside
      // this.pullThePlug();
    }else{
      // console.log('think', this.status)
      if(this.status === STATUS.BRAINDEAD){
        // should i do something?
        if(this.timer){
          // no, busy
        }else{
          this.startDoing();
        }
      }
    }
  }

  startDoing(callback){
    this.status = STATUS.DOING;
    this.startTimer(this.status, callback, this.getDuration(STATUS.DOING));
  }

  startThinking(callback){
    this.status = STATUS.THINKING;
    this.startTimer(this.status, callback, this.getDuration(STATUS.THINKING));
  }

  onTimerComplete(type, callback){
    if(type !== this.status){
      console.error('I havent really decided what to use yet, but this is unexpected')
    }

    switch (this.status){
      case STATUS.THINKING: {
        // trigger the DO
        this.onThinkComplete && this.onThinkComplete();
        callback && callback();
        this.startDoing();
      } break;
      case STATUS.DOING: {
        // trigger the THINK
        this.onDoComplete && this.onDoComplete();
        callback && callback();
        this.startThinking();
      } break;
      case STATUS.BRAINDEAD: {
        // do nothing, shouldnt be here anyways
        console.error('should not have finished a timer in a different status')
      } break;
    }
    // move to the next state
    // do the callback
  }


}

export default PetBrain;


/*
  (loop start)
    based on [ input, status ] then [ moods, stats, ]
    decide next: X
    start it:
      - animation
      - activity
  (dynamic time)
    idle animation, 
    start think...
  (dynamic time)
    repeat loop
*/