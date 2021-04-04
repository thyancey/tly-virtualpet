import { ContactsOutlined } from "@material-ui/icons";
import { getValOrRandRange, randBetween } from "../../../util/tools";

let sceneContext;
const ALPHA_TEXTURE = 1;
const ALPHA_BODY = 0;

let gSceneInfo = {};
let gBg = null;
let gGameBounds = {};
let group_floors = [];
let group_platforms = [];


const setContext = (context) => {
  sceneContext = context;
}

const preload = () => {
  sceneContext.load.image('bg', gSceneInfo.background.imageUrl);
  console.log(gSceneInfo);
  Object.keys(gSceneInfo.textures).forEach(spriteName => {
    sceneContext.load.image(getTextureId(spriteName), gSceneInfo.textures[spriteName].imageUrl);
  });
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

  stretchToBounds();
}

const stretchToBounds = () => {
  const bg = gSceneInfo.background;

  gBg.width = bg.size[0];
  gBg.height = bg.size[0];

  if(bg.scale.width === 'stretch'){
    gBg.displayWidth = gGameBounds.w;
  } else if(bg.scale.width === 'auto'){
    gBg.displayWidth = bg.size[0] * (bg.spriteScale || 1);
  }

  if(bg.scale.height === 'stretch'){
    gBg.displayHeight = gGameBounds.h;
  } else if(bg.scale.height === 'auto'){
    gBg.displayHeight = bg.size[1] * (bg.spriteScale || 1);
  }

  //diff between image and page height
  let diff = gBg.displayHeight - gGameBounds.h;
  gBg.y = -diff;
  
  gBg.width = 2000;
  gBg.height = 2000;
  positionPlatforms(gGameBounds)
  positionFloor(gGameBounds)
}

const positionFloor = gameBounds => {
  let floorY = gameBounds.h - gSceneInfo.floor.height;

  setPlatformToPosition(group_floors[0].body, group_floors[0].texture, {
    x: 0,
    y: floorY,
    w: gameBounds.w,
    h: gSceneInfo.floor.height,
  });
}

const positionPlatforms = (gameBounds) => {
  let floorY = gameBounds.h - gSceneInfo.floor.height;

  group_platforms.forEach((pGroup, p) => {
    let pParams = gSceneInfo.platforms[p];
    
    if(pParams.type === 'rando'){
      positionPlatformGroup_rando(pGroup, pParams, floorY, gameBounds.w)
    }else if(pParams.type === 'stairs'){
      positionPlatformGroup_stairs(pGroup, pParams, floorY, gameBounds.w)
    } else{
      console.log('invalid type ', pParams.type)
    }
  })
}

// can make random stairs, needs an "up and down" type of thing and needs to get the full widths correct when x becomes random
const positionPlatformGroup_stairs = (pGroup, pParams, floorY) => {
  let xOffset = getValOrRandRange(pParams.x) || 0;

  pGroup.forEach((pObj, i) => {
    let stepX = getValOrRandRange(pParams.stepX, 1) || 0;
    let stepY = getValOrRandRange(pParams.stepY, 1) || 0;

    let size = {
      x: stepX * pParams.size,
      y: stepY * pParams.size
    }

    let p = pObj.body;
    let tex = pObj.texture;

    let pW = size.x * (pGroup.length - i);
    let pH = size.y;

    let values = {
      x: xOffset + size.x * i, 
      y: pParams.size * (i) + size.y,
      w: pW,
      h: pH
    };
    
    if(pParams.snap){
      values = snapValues(values, pParams.snap);
    }
    values.y = floorY - values.y;

    setPlatformToPosition(p, tex, values);
  });
}

const positionPlatformGroup_rando = (pGroup, pParams, floorY, gameWidth) => {
  pGroup.forEach((pObj, i) => {
    let p = pObj.body;
    let tex = pObj.texture;

    let pW = getValOrRandRange(pParams.width);
    let pH = getValOrRandRange(pParams.height);

    let values = {
      x: randBetween([ pParams.xBuffer.left, gameWidth - pW - pParams.xBuffer.right ]),
      y: pH,
      w: pW,
      h: pH
    };
    
    if(pParams.snap){
      values = snapValues(values, pParams.snap);
    }
    values.y = floorY - values.y;

    setPlatformToPosition(p, tex, values);

  });
}

const roundSnap = (value, snap) => snap * Math.round(value / snap);

const snapValues = (values, snap) => {
  return {
    x: roundSnap(values.x, snap),
    y: roundSnap(values.y, snap),
    w: roundSnap(values.w, snap),
    h: roundSnap(values.h, snap)
  }
}

const setPlatformToPosition = (platform, texture, pos) => {
  platform.setPosition(pos.x, pos.y);
  platform.displayWidth = pos.w;
  platform.displayHeight = pos.h;

  // physics
  platform.body.position = { x: pos.x, y: pos.y };
  platform.body.position = { x: pos.x, y: pos.y };
  platform.body.width = pos.w;
  platform.body.height = pos.h;
  platform.body.reset();

  if(texture){
    texture.setPosition(pos.x, pos.y)
    texture.width = pos.w;
    texture.height = pos.h;
  }
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

const create = (levelData) => {
  const physGroup_floors = sceneContext.physics.add.staticGroup();
  const physGroup_platforms = sceneContext.physics.add.staticGroup();

  group_floors.push(makePlatform(physGroup_floors, getSpriteDef(gSceneInfo.floor.texture)));

  global.infoo = gSceneInfo;
  // just for testin
  makePlatforms(physGroup_platforms, gSceneInfo.platforms);
  // makePlatformGroup(physGroup_platforms, getSpriteDef(gSceneInfo.platforms[0].texture), gSceneInfo.platforms[0].count)

  // bg image
  gBg = sceneContext.add.tileSprite(0, 0, 545, 545, 'bg').setOrigin(0, 0).setDepth(-1);

  return {
    floors: physGroup_floors,
    platforms: physGroup_platforms
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