import Pet from './pet';
import { throttle } from 'throttle-debounce';

const groups = {};
const gPetInfo = {};
let sceneContext;
let preloadCompleted = false;
const THROTTLE_SPEED = 150;

const setContext = (context) => {
  sceneContext = context;
}

const alterPetInfo = (id, phaserPetDef) => {
  if(!gPetInfo[id]){
    gPetInfo[id] = { 
      ...phaserPetDef,
      registeredSprites: registerSprites(id, phaserPetDef.sprites)
    }

    console.log('registered', gPetInfo[id])
    console.log('registered', gPetInfo[id].registeredSprites)

    if(preloadCompleted){
      loadPetImagesAfterPreload(phaserPetDef.id);
    }
  }else {
    // when you've loaded a pet before, so just skip around
  }
}


const loadPetImagesAfterPreload = id => {
  const spriteDefs = getPetInfo(id).registeredSprites;
  Object.keys(spriteDefs).forEach(spriteDefKey => {
    sceneContext.load.atlas(
      spriteDefs[spriteDefKey].id, 
      spriteDefs[spriteDefKey].image, 
      spriteDefs[spriteDefKey].data
    );
  });

  sceneContext.load.once('complete', () => onPetImagesReloadComplete(id));
  sceneContext.load.start();
}

const onPetImagesReloadComplete = petId => {
  createSpritesForPetId(petId);
}

const getPetInfo = id => {
  if(!gPetInfo[id]) console.error(`SpawnController: could not get petInfo for ${id}`);
  return gPetInfo[id] || null;
}

const registerSprites = (id, sprites) => {
  let spriteDefs = {};
  Object.keys(sprites).forEach(spriteKey => {
    spriteDefs[spriteKey] = {
      id: spriteKey,
      image: `./data/pets/${id}/assets/${sprites[spriteKey].image}`, 
      data: `./data/pets/${id}/assets/${sprites[spriteKey].data}`,
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

const createSprites = () => {
  Object.keys(gPetInfo).forEach(petId => {
    createSpritesForPetId(petId);
  });
}

const createSpritesForPetId = (petId) => {
  createSpritesForPet(petId, getPetInfo(petId).sprites, getPetInfo(petId).animations, sceneContext)
}

const createSpritesForPet = (petId, spriteDefs, animationDefs, sceneContext) => {
  // console.log('creating sprites for ', petId);

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

  preloadCompleted = true;
}

const preloadSprites = (sceneContext) => {
  Object.keys(gPetInfo).forEach(petKey => {
    preloadSpritesForPet(getPetInfo(petKey).registeredSprites, sceneContext)
  });
}

const preloadSpritesForPet = (registeredSprites, sceneContext) => {
  Object.keys(registeredSprites).forEach(spriteDefKey => {
    sceneContext.load.atlas(
      registeredSprites[spriteDefKey].id, 
      registeredSprites[spriteDefKey].image, 
      registeredSprites[spriteDefKey].data
    );
  });
}

const create = (sceneContext) => {
  createSprites();

  groups.pets = sceneContext.physics.add.group();
  return groups;
}

const update = () => {
  groups.pets?.children.iterate(entity => {
    entity.update();
  });
  
  throttledUpdate();
}

const onThrottledUpdate = () => {
  groups.pets?.children.iterate(entity => {
    entity.throttledUpdate();
  });
}
const throttledUpdate = throttle(THROTTLE_SPEED, false, onThrottledUpdate);

/* right now, there should be only one pet at a time. in the future, support multiples */
const spawnPet = (id) => {
  despawnEverything();
  spawnIt(Pet.Entity, id, { x: 100, y: 0 }, {}, getPetInfo(id), true);
  // spawnClones(() => { spawnIt(Pet.Entity, id, { x: 100, y: 0 }, {}, getPetInfo(id).petInfo, false) }, 10)
}

const spawnClones = (command, count) => {
  for(let i = 0; i < count; i++){
    command();
  }
}

const despawnEverything = () => {
  groups.pets?.children.iterate(child => {
    child.destroy();
  });
}

const spawnIt = (EntityRef, id, position, stats, petInfo, canSendUpdates = false) => {
  console.log('Spawn.spawnIt: ', id, petInfo);
  return new EntityRef(sceneContext, groups.pets, {
    id: id,
    x: position.x,
    y: position.y,
    stats: stats,
    petInfo: petInfo,
    canSendUpdates: canSendUpdates
  });
}

const updatePetAnimationLabel = (id, label) => {
  groups.pets?.children.iterate(entity => {
    if(entity.id === id){
      // console.log('playAnimation', label)
      entity.playAnimation(label);
    }
  });
}
const updatePetActivities = (id, data) => {
  groups.pets?.children.iterate(entity => {
    if(entity.id === id){
      entity.updateActivities(data);
    }
  });
}
const updatePetMortality = (id, isAlive) => {
  groups.pets?.children.iterate(entity => {
    if(entity.id === id){
      entity.updateMortality(isAlive);
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
  updatePetMortality,
  alterPetInfo,
  spawnPet
}
export default exports;