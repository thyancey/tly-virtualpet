import { 
  stretchBgToBounds,
  positionFloor, 
  positionPlatforms,
} from './utils';

let sceneContext;
const ALPHA_TEXTURE = 1;
const ALPHA_BODY = 0;

let gSceneInfo = {};
let gBgImage = null;
let gGameBounds = {};
let group_floors = [];
let group_platforms = [];


const setContext = (context) => {
  sceneContext = context;
}

const preload = () => {
  sceneContext.load.image('bg', gSceneInfo.background.imageUrl);
  Object.keys(gSceneInfo.textures).forEach(spriteName => {
    sceneContext.load.image(getTextureId(spriteName), gSceneInfo.textures[spriteName].imageUrl);
  });
}

const create = (levelData) => {
  const physGroup_floors = sceneContext.physics.add.staticGroup();
  const physGroup_platforms = sceneContext.physics.add.staticGroup();

  group_floors.push(makePlatform(physGroup_floors, getSpriteDef(gSceneInfo.floor.texture)));
  makePlatforms(physGroup_platforms, gSceneInfo.platforms);

  gBgImage = sceneContext.add.tileSprite(0, 0, 545, 545, 'bg').setOrigin(0, 0).setDepth(-1);

  return {
    floors: physGroup_floors,
    platforms: physGroup_platforms
  }
}

const getTextureId = id => {
  return `scene-${gSceneInfo.id}-${id}`;
}

const updateBounds = (x, y, w, h) => {
  gGameBounds = {
    x,
    y,
    w,
    h
  }

  gBgImage = stretchBgToBounds(gBgImage, gSceneInfo, gGameBounds);
  positionPlatforms(group_platforms, gSceneInfo, gGameBounds);
  positionFloor(group_floors, gSceneInfo, gGameBounds);
}

const getSpriteDef = textureId => {
  if(!textureId) return null;
  try{
    return gSceneInfo.textures[textureId];
  }catch(e){
    console.error(`could not find level texture ${textureId}`);
    return null;
  }
}


const makePlatforms = (group, platformDefs) => {
  platformDefs.forEach(platformDef => {
    const textureDef = gSceneInfo.textures[platformDef.texture];
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

const setSceneInfo = sceneInfo => {
  console.log('setSceneInfo', sceneInfo)
  gSceneInfo = sceneInfo;
}

const exports = {
  setContext,
  preload,
  create,
  updateBounds,
  setSceneInfo
}

export default exports;