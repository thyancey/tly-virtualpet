import { 
  stretchBgToBounds,
  positionFloor, 
  positionPlatforms,
} from './utils';

let sceneContext;
const ALPHA_TEXTURE = 1;
const ALPHA_BODY = 0;

let gScenesInfo = {};
let gSceneId = null;

let gBgImage = null;
let gGameBounds = {};
let group_floors = [];
let group_platforms = [];

let gPreloadCompleted = false;


let physGroup_floors;
let physGroup_platforms;


const setContext = (context) => {
  sceneContext = context;
}

const preload = () => {
  preloadSprites(sceneContext)
  gPreloadCompleted = true;
}

const preloadSprites = (sceneContext) => {
  sceneContext.load.image(getTextureId('bg'), getSceneInfo().background.imageUrl);
  Object.keys(getSceneInfo().textures).forEach(spriteName => {
    sceneContext.load.image(getTextureId(spriteName), getSceneInfo().textures[spriteName].imageUrl);
  });
}

const loadSpritesAfterPreload = sceneId => {
  sceneContext.load.image(getTextureId('bg'), getSceneInfo().background.imageUrl);
  Object.keys(getSceneInfo().textures).forEach(spriteName => {
    sceneContext.load.image(getTextureId(spriteName), getSceneInfo().textures[spriteName].imageUrl);
  });
  
  sceneContext.load.once('complete', () => onSpritesLoadComplete(sceneId));
  sceneContext.load.start();
}

const onSpritesLoadComplete = petId => {
  removeTheOldStuff();
  makeTheStuff(physGroup_floors, physGroup_platforms);
  resize();
}

const removeTheOldStuff = () => {
  global.pP = physGroup_platforms;
  global.pG = group_platforms

  group_floors.forEach(p => {
    p.body.destroy();
    p.texture && p.texture.destroy();
  })

  group_platforms.forEach(gP => {
    gP.forEach(p => {
      p.body.destroy();
      p.texture && p.texture.destroy();
    })
  })

}

const create = (levelData) => {
  physGroup_floors = sceneContext.physics.add.staticGroup();
  physGroup_platforms = sceneContext.physics.add.staticGroup();

  return makeTheStuff(physGroup_floors, physGroup_platforms)
}

const makeTheStuff = (physGroup_floors, physGroup_platforms) => {
  group_floors = [];
  group_platforms = [];

  group_floors.push(makePlatform(physGroup_floors, getSpriteDef(getSceneInfo().floor.texture)));
  makePlatforms(physGroup_platforms, getSceneInfo().platforms);

  gBgImage = sceneContext.add.tileSprite(0, 0, 545, 545, getTextureId('bg')).setOrigin(0, 0).setDepth(-1);

  return {
    floors: physGroup_floors,
    platforms: physGroup_platforms
  }
}


const getTextureId = id => {
  return `scene-${getSceneInfo().id}-${id}`;
}

const updateBounds = (x, y, w, h) => {
  gGameBounds = {
    x,
    y,
    w,
    h
  }

  resize();
}

const resize = () => {
  gBgImage = stretchBgToBounds(gBgImage, getSceneInfo(), gGameBounds);
  positionPlatforms(group_platforms, getSceneInfo(), gGameBounds);
  positionFloor(group_floors, getSceneInfo(), gGameBounds);
}

const getSpriteDef = textureId => {
  if(!textureId) return null;
  try{
    return getSceneInfo().textures[textureId];
  }catch(e){
    console.error(`could not find level texture ${textureId}`);
    return null;
  }
}


const makePlatforms = (group, platformDefs) => {
  platformDefs.forEach(platformDef => {
    const textureDef = getSceneInfo().textures[platformDef.texture];
    group_platforms.push(makePlatformGroup(group, textureDef, platformDef.count));
  });
}
const makePlatformGroup = (group, textureDef, count) => {
  let plattys = []
  for(let i = 0; i < count; i++){
    plattys.push(makePlatform(group, textureDef));
  }
  return plattys;
}

const makePlatform = (group, textureDef) => {
  return {
    body: group.create(0, 0, null).setScale(1, 1).setOrigin(0,0).setAlpha(ALPHA_BODY).refreshBody(),
    texture: textureDef ? addTexturedTileSprite(textureDef) : null
  }
}

const addTexturedTileSprite = textureDef => {
  return sceneContext.add.tileSprite(0, 0, textureDef.width, textureDef.height, getTextureId(textureDef.id)).setOrigin(0, 0).setTileScale(textureDef.spriteScale, textureDef.spriteScale).setAlpha(ALPHA_TEXTURE)
}

const getSceneInfo = sceneId => {
  if(!sceneId) sceneId = gSceneId;

  if(!gScenesInfo[sceneId]) console.error(`SceneController: could not get sceneInfo for ${sceneId}`);
  return gScenesInfo[sceneId] || null;
}

const setSceneInfo = sceneInfo => {
  console.log('setSceneInfo', sceneInfo)
  gScenesInfo[sceneInfo.id] = sceneInfo;
  gSceneId = sceneInfo.id;

  if(gPreloadCompleted){
    loadSpritesAfterPreload(gSceneId);
  }
}

const exports = {
  setContext,
  preload,
  create,
  updateBounds,
  setSceneInfo
}

export default exports;