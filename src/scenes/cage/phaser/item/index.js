import Phaser from 'phaser';

const LAZY_STATS = {
  speed: 250,
  bounciness: 0,
  drag: 300
}

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData) {
    super(scene, spawnData.x, spawnData.y, spawnData.id);

    this.id = spawnData.entityInfo.id;
    this.statEvents = spawnData.entityInfo.statEvents || {};
    this.stats = spawnData.stats || {};
    const firstSheetKey = Object.keys( spawnData.entityInfo?.sprites)[0];

    this.setBehaviors(spawnData.entityInfo.behaviors);
    this.spriteScale =  spawnData.entityInfo.sprites[firstSheetKey].scale || 1;
    const frameDims =  spawnData.entityInfo.sprites[firstSheetKey].frameDims || [ 0, 0 ];

    // maybe remove later? adjusts hitbox for sprite
    const frameSqueeze =  spawnData.entityInfo.sprites[firstSheetKey].frameSqueeze || { x: 0, y: 0, w: 0, h: 0 };

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
    this.body.setSize(frameDims[0] + frameSqueeze.w, frameDims[1] + frameSqueeze.h);
    this.body.offset.x = frameSqueeze.x;
    this.body.offset.y = frameSqueeze.y;
    this.body.setDrag(LAZY_STATS.drag);

    this.playAnimation();
  }

  setBehaviors(behaviorsData){
    this.behaviorsData = behaviorsData;
    this.curBehaviorId = Object.keys(this.behaviorsData)[0];
  }

  getBehaviorAnimation(){
    return this.behaviorsData[this.curBehaviorId].animations[0];
  }

  update(){
    // console.log()
    //- turn if facing left
    if(this.flipX){
      if(this.body.velocity.x >= 0) this.flipX = false;
    }else{
      if(this.body.velocity.x < 0) this.flipX = true;
    }
  }

  getItemEffects(){
    return this.statEvents[0].statEffects.map(sE => ({
      id: sE.id,
      value: sE.immediate
    }));
  }

  throttledUpdate(){}

  playAnimation(animKey){
    if(!animKey){
      animKey = this.getBehaviorAnimation();
    }
    if(this.curAnimation !== animKey){
      this.curAnimation = animKey;
      this.anims.play(animKey).setScale(this.spriteScale).setOrigin(0);
    }
  }
}

const exports = {
  Entity
}

export default exports;