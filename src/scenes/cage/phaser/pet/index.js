import Phaser from 'phaser';
import PetBrain from './pet-brain';
import Events from '../event-emitter';


const LAZY_STATS = {
  speed: 250,
  jumpHeight: 500,
  bounciness: 0,
  drag: 300,
  roamChance: .01
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, spawnData.id);
    // console.log('Pet.Constructor ', spawnData.id, spawnData.petInfo);

    this.id = spawnData.petInfo.id;
    this.stats = spawnData.stats || {};
    this.petInfo = spawnData.petInfo;
    this.spriteScale = this.petInfo?.data?.atlas?.sprites?.MAIN?.scale || 1;
    this.canSendUpdates = spawnData.canSendUpdates;
    const frameDims = this.petInfo?.data?.atlas?.sprites?.MAIN?.frameDims || [ 0, 0 ];
    // this.spriteFramerate = this.petInfo?.data?.atlas?.sprites?.Main?.framerate || 10;

    //- custom properties

    //- parent stuff
    scene.add.existing(this);
    if(physicsGroup){
      physicsGroup.add(this);
    }else{
      scene.physics.add.existing(this);
    }
    
    //- physics
    this.setBounce(LAZY_STATS.bounciness);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(frameDims[0], frameDims[1]);
    this.body.offset.x = 0;
    this.body.offset.y = 0;
    this.body.setDrag(LAZY_STATS.drag);

    global.pet = this;
    this.isAlive = true;
    this.personality = spawnData.petInfo.data.personality;
    this.activities = [];

    
    this.petBrain = new PetBrain(this.onBrainDoComplete.bind(this), this.onBrainThinkComplete.bind(this));
    this.petBrain.setPersonality(this.petInfo.data.personality);
  }


  update(){
    // console.log()
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x >= 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }

    
    if(this.isAlive){
      this.checkRoamingStuff();
    }
  }

  throttledUpdate(keysDown = []){

    if(this.isAlive){
      // if you wanna turn off thinking for some reason (ex, user input)
      // this.petBrain.pullThePlug();
      this.petBrain.think([], []);
    }


    // console.log('throttledUpdate');

    if(this.canSendUpdates){
      /* RIGHT NOW, used for sending status back to the react app */
      let activities = [];
      if(!this.body.onFloor() && Math.abs(this.body.velocity.y) > .5){
        activities.push('JUMPING');
      }
      if(Math.abs(this.body.velocity.x) > .5){
        activities.push('WALKING');
      }
      if(this.isRoaming){
        activities.push('ROAMING');
      }
  
      this.sendActivities(activities);
    }
  }

  onBrainDoComplete(){
    this.stopRoaming();
  }

  onBrainThinkComplete(){
    this.startRoaming();
  }

  startRoaming(){
    this.isRoaming = true;
  }

  stopRoaming(forced){
    this.isRoaming = false;
  }

  updateActivities(activities){
    // console.log('updateActivities', activities)
    this.activities = activities;
  }

  hasActivity(activity){
    return this.activities.indexOf(activity) > -1;
  }
  
  setBehaviors(behaviors){
    this.behaviors = behaviors;
  }

  hasBehavior(behavior){
    return this.behaviors.indexOf(behavior) > -1;
  }

  checkRoamingStuff(){
    
    if(this.body.onWall()){
      this.flipAndMove(1);
    }else{
      if(this.body.onFloor() && this.hasActivity('ROAMING')){
        //idle movements
        if(Math.random() < this.personality.jumpChance){
          this.jump(20);
        }else{
          this.keepRoaming(1);
        }
      }
    }
  }

  flipAndMove(mod = 1){
    if(this.body.velocity.x > 0){
      this.move(-1 * mod);
    }else{
      this.move(1 * mod);
    }
  }

  keepRoaming(){
    let mod = 1;
    if(this.body.velocity.x < 0){
      mod = -1;
    }

    this.move(mod);
  }

  jump(mod = 0){
    if(this.body.onFloor()){
      this.setVelocityY(-1 * LAZY_STATS.jumpHeight);
      // console.log('JUMP')
      // this.addActivity('JUMPING');
    }
  }

  move(modifier){
    this.body.velocity.x = LAZY_STATS.speed * modifier;
  }


  // hasActivity(activityKey){
  //   return this.activities.indexOf(activityKey) > -1
  // }

  playAnimation(animKey){
    // console.log('playAnimation', animKey)
    if(this.curAnimation !== animKey){
      this.curAnimation = animKey;
      this.anims.play(animKey).setScale(this.spriteScale).setOrigin(0);
    }
  }

  addActivity(activity){
    if(!this.hasActivity(activity)){
      // console.log('pet.emit', 'addActivity')
      Events.emit('interface', 'addActivity', activity);
    }
  }

  sendActivities(activities){
    Events.emit('sendStatus', activities);
  }

  removeActivity(activity){
    if(this.hasActivity(activity)){
      console.log('removiong with ', this.activities)
      Events.emit('interface', 'removeActivity', activity);
    }
  }
}


const updatePetInfo = (petInfo) => {
  console.log('Pet.updatePetInfo', petInfo);
}


const exports = {
  Entity,
  updatePetInfo
}

export default exports;