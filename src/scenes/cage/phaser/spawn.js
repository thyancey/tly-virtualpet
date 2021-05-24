import Pet from './pet';
import Item from './item';
import { throttle } from 'throttle-debounce';

const groups = {};
const gPetInfo = {};
const gItemInfo = {};
let sceneContext;
let preloadCompleted = false;
const THROTTLE_SPEED = 150;

const setContext = (context) => {
  sceneContext = context;
}

const alterItemsInfo = (items) => {
  items.forEach(i => {
    const id = i.id;
    if(!gItemInfo[id]){
      gItemInfo[id] = { 
        ...i,
        registeredSprites: registerSprites(id, './data/items', i.sprites)
      }
  
      // console.log('alterItemInfo, registered: ', gItemInfo[id].registeredSprites);
    }else {
      // when you've loaded an item before, so just skip around
    }
  });

  if(preloadCompleted){
    loadItemImagesAfterPreload(items.map(i => i.id));
  }
}


const loadItemImagesAfterPreload = itemIds => {
  // console.log('loadItemImagesAfterPreload');
  const allSpriteDefs = [itemIds.map(id => gItemInfo[id].registeredSprites)]
  Object.keys(allSpriteDefs).forEach(spriteDefKey => {
    sceneContext.load.atlas(
      allSpriteDefs[spriteDefKey].id, 
      allSpriteDefs[spriteDefKey].image, 
      allSpriteDefs[spriteDefKey].data
    );
  });

  sceneContext.load.once('complete', () => onItemImagesReloadComplete(itemIds));
  sceneContext.load.start();
}

const onItemImagesReloadComplete = itemIds => {
  itemIds.forEach(itemId => {
    createSpritesFromData(itemId, getItemInfo(itemId).sprites, getItemInfo(itemId).animations, sceneContext);
  });
}

const alterPetInfo = (id, phaserPetDef) => {
  if(!gPetInfo[id]){
    gPetInfo[id] = { 
      ...phaserPetDef,
      registeredSprites: registerSprites(id, './data/pets', phaserPetDef.sprites)
    }

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
  createSpritesFromData(petId, getPetInfo(petId).sprites, getPetInfo(petId).animations, sceneContext);
}

const getPetInfo = id => {
  if(!gPetInfo[id]) console.error(`SpawnController: could not get petInfo for ${id}`);
  return gPetInfo[id] || null;
}
const getItemInfo = id => {
  if(!gItemInfo[id]) console.error(`SpawnController: could not get itemInfo for ${id}`);
  return gItemInfo[id] || null;
}

const registerSprites = (id, path, sprites) => {
  let spriteDefs = {};
  Object.keys(sprites).forEach(spriteKey => {
    spriteDefs[spriteKey] = {
      id: spriteKey,
      image: `${path}/${id}/assets/${sprites[spriteKey].image}`, 
      data: `${path}/${id}/assets/${sprites[spriteKey].data}`,
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
    createSpritesFromData(petId, getPetInfo(petId).sprites, getPetInfo(petId).animations, sceneContext);
  });

  Object.keys(gItemInfo).forEach(itemId => {
    createSpritesFromData(itemId, getItemInfo(itemId).sprites, getItemInfo(itemId).animations, sceneContext);
  });
}


const createSpritesFromData = (id, spriteDefs, animationDefs, sceneContext) => {
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
    preloadSpritesFromData(getPetInfo(petKey).registeredSprites, sceneContext)
  });

  Object.keys(gItemInfo).forEach(itemKey => {
    // console.log("DO IT", itemKey, getItemInfo(itemKey))
    preloadSpritesFromData(getItemInfo(itemKey).registeredSprites, sceneContext)
  });
}

const preloadSpritesFromData = (registeredSprites, sceneContext) => {
  Object.keys(registeredSprites).forEach(spriteDefKey => {
    // if(spriteDefKey === 'i_mushroom_default') return;
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
  groups.items = sceneContext.physics.add.group();
  return groups;
}

const update = () => {
  groups.pets?.children.iterate(entity => {
    entity.update();
  });
  groups.items?.children.iterate(entity => {
    entity.update();
  });
  
  throttledUpdate();
}

const onThrottledUpdate = () => {
  groups.pets?.children.iterate(entity => {
    entity.throttledUpdate();
  });
  groups.items?.children.iterate(entity => {
    entity.throttledUpdate();
  });
}
const throttledUpdate = throttle(THROTTLE_SPEED, false, onThrottledUpdate);

const spawnItemId = (itemId, coords) => {
  coords = coords || { x: 0, y: 0 }

  spawnItem(Item.Entity, itemId, coords, {}, getItemInfo(itemId));
}

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

const spawnItem = (EntityRef, id, position, stats, itemInfo) => {
  // console.log('Spawn.spawnIt: ', id, itemInfo);
  return new EntityRef(sceneContext, groups.items, {
    id: id,
    x: position.x,
    y: position.y,
    stats: stats,
    entityInfo: itemInfo
  });
}

const spawnIt = (EntityRef, id, position, stats, petInfo, canSendUpdates = false) => {
  // console.log('Spawn.spawnIt: ', id, petInfo);
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
  alterItemsInfo,
  spawnPet,
  spawnItemId
}
export default exports;