import Phaser from 'phaser';
/*
stats = {
  speed: [ minSpeedX, maxSpeedX ]
}
*/

class Entity extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, physicsGroup, spawnData, petInfo) {
    super(scene, spawnData.x, spawnData.y, spawnData.id);
    console.log('Pet.Constructor ', spawnData.id, spawnData.petInfo);

    this.id = spawnData.petInfo.id;
    this.stats = spawnData.stats || {};
    this.petInfo = spawnData.petInfo;
    this.spriteScale = this.petInfo?.data?.atlas?.sprites?.MAIN?.scale || 1;
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
    this.setBounce(0);
    this.setCollideWorldBounds(true);
    this.allowGravity = false;

    //- squeeze in hit box from edge of sprite
    this.body.setSize(frameDims[0], frameDims[1]);
    this.body.offset.x = 0;
    this.body.offset.y = 0;

    // this.playAnimation('Walk_Big');
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

  playAnimation(animKey){
    // console.log('playAnimation', animKey)
    this.anims.play(animKey).setScale(this.spriteScale).setOrigin(0);
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