import Phaser from 'phaser';
import Pet from './pet.js';
import { throttle } from 'throttle-debounce';

const groups = {};
const gPetInfo = {};
let sceneContext;
const THROTTLE_SPEED = 150;

const setContext = (context) => {
  sceneContext = context;
}

const setPetInfo = (id, petInfo) => {
  console.log('Spawn.setPetInfo: ', petInfo);
  if(gPetInfo[id]){
    console.error(`Spawn.setPetInfo: already set for ${id}`);
  }else {
    const sprites = registerSprites(id, petInfo.data?.atlas);

    gPetInfo[id] = {
      atlas: petInfo.data.atlas,
      petInfo: petInfo,
      sprites: sprites
    };
  }
}

const getPetInfo = id => {
  if(!gPetInfo[id]) console.error(`SpawnController: could not get petInfo for ${id}`);
  return gPetInfo[id] || null;
}

const registerSprites = (id, atlasInfo) => {
  const sprites = atlasInfo.sprites;
  let spriteDefs = {};

  Object.keys(sprites).forEach(spriteKey => {
    spriteDefs[spriteKey] = {
      id: spriteKey,
      image: `./data/pets/bario/assets/${sprites[spriteKey].image}`, 
      data: `./data/pets/bario/assets/${sprites[spriteKey].data}`,
      defaults: sprites[spriteKey].defaults || { animation: {}, frameObj: {} }
    };
  });

  return spriteDefs;
}

const getCleanAnimationDef = (given, defaults) => {
  return {
    ...defaults.animation,
    ...given,
    frameObj: {
      ...given.frameObj,
      ...defaults.frameObj
    }
  }
}

const createSprites = (sceneContext) => {
  Object.keys(gPetInfo).forEach(petKey => {
    createSpritesForPet(petKey, getPetInfo(petKey).sprites, getPetInfo(petKey).atlas.animations, sceneContext)
  });
}

const createSpritesForPet = (petId, spriteDefs, animationDefs, sceneContext) => {

  Object.keys(animationDefs).forEach(animationKey => {
    const spriteId = animationDefs[animationKey].sprite;
    const animationDef = getCleanAnimationDef(animationDefs[animationKey], spriteDefs[spriteId].defaults);
    sceneContext.anims.create({ 
      key: animationKey, 
      frameRate: animationDef.frameRate, 
      frames: sceneContext.anims.generateFrameNames(
        animationDef.sprite, 
        animationDef.frameObj
      ),
      repeat: animationDef.repeat
    });
  });
}

const preload = (sceneContext) => {
  preloadSprites(sceneContext);
}

const preloadSprites = (sceneContext) => {
  Object.keys(gPetInfo).forEach(petKey => {
    preloadSpritesForPet(getPetInfo(petKey).sprites, sceneContext)
  });
}

const preloadSpritesForPet = (spriteDefs, sceneContext) => {
  Object.keys(spriteDefs).forEach(spriteDefKey => {
    sceneContext.load.atlas(
      spriteDefs[spriteDefKey].id, 
      spriteDefs[spriteDefKey].image, 
      spriteDefs[spriteDefKey].data
    );
  });
}

const create = (sceneContext) => {
  console.log('> spawn.create');
  createSprites(sceneContext);

  groups.pets = sceneContext.physics.add.group();
  return groups;
}

const update = () => {
  groups.pets.children.each(entity => {
    entity.update();
  });
  
  throttledUpdate();
}

const onThrottledUpdate = () => {
  groups.pets.children.each(entity => {
    entity.throttledUpdate();
  });
}
const throttledUpdate = throttle(THROTTLE_SPEED, false, onThrottledUpdate);


const spawnPet = (id, petInfo) => {
  spawnIt(Pet.Entity, id, { x: 100, y: 0 }, {}, getPetInfo(id).petInfo);
}

const spawnIt = (EntityRef, id, position, stats, petInfo) => {
  console.log('Spawn.spawnIt: ', id, petInfo)
  return new EntityRef(sceneContext, groups.pets, {
    id: id,
    x: position.x,
    y: position.y,
    stats: stats,
    petInfo: petInfo
  });
}

const updatePetAnimationLabel = (id, label) => {
  groups?.pets?.children?.each(entity => {
    if(entity.id === id){
      entity.playAnimation(label);
    }
  });
}
const updatePetActivities = (id, data) => {
  groups?.pets?.children?.each(entity => {
    if(entity.id === id){
      entity.updateActivities(data);
    }
  });
}

const exports = {
  setContext,
  preload,
  create,
  update,
  updatePetAnimationLabel,
  updatePetActivities,
  setPetInfo,
  spawnPet
}
export default exports;