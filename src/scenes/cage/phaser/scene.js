import { randBetweenThese } from "../../../util/tools";

let sceneContext;
const DEBUG_ALPHA = .5;
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

  
  console.log('gGameBounds', gGameBounds)
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

  setPlatformToPosition(group_floors[0], {
    x: 0,
    y: floorY,
    w: gameBounds.w,
    h: gSceneInfo.floor.height,
  });
}

const positionPlatforms = (gameBounds) => {
  let floorY = gameBounds.h - gSceneInfo.floor.height;
  let pParams = gSceneInfo.platforms;

  group_platforms.forEach((p, i) => {


    if(pParams.type === 'stairs'){
      let mods = {
        x:i,
        y:i,
        w:1,
        h:1
      }

      setPlatformToPosition(p, {
        x: pParams.spread * mods.x + pParams.offsetX,
        y: floorY - pParams.offsetY - pParams.elevation * mods.y,
        w: pParams.width * mods.w,
        h: pParams.height * mods.h
      });
    }else if(pParams.type === 'rando'){
      let pW = randBetweenThese(pParams.width[0], pParams.width[1]);
      let pH = randBetweenThese(pParams.height[0], pParams.height[1]);

      setPlatformToPosition(p, {
        x: randBetweenThese(pParams.xBuffer[0], gameBounds.w - pW - pParams.xBuffer[1]),
        y: floorY - pH,
        w: pW,
        h: pH
      });
    }
  })
}

const setPlatformToPosition = (platform, pos) => {
  platform.setPosition(pos.x, pos.y);
  platform.displayWidth = pos.w;
  platform.displayHeight = pos.h;

  // physics
  platform.body.position = { x: pos.x, y: pos.y };
  platform.body.position = { x: pos.x, y: pos.y };
  platform.body.width = pos.w;
  platform.body.height = pos.h;
  platform.body.reset();
}

const create = (levelData) => {
  const physGroup_floors = sceneContext.physics.add.staticGroup();
  const physGroup_platforms = sceneContext.physics.add.staticGroup();


  let floorSprite = null;
  group_floors.push(physGroup_floors.create(0, 0, floorSprite).setScale(1, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody());

  // just for testin
  let platformSprite = null;
  makePlatforms(physGroup_platforms, platformSprite, gSceneInfo.platforms.count)

  // bg image
  gBg = sceneContext.add.tileSprite(0, 0, 545, 545, 'bg').setOrigin(0, 0).setDepth(-1);

  return {
    floors: physGroup_floors,
    platforms: physGroup_platforms
  }
}

const makePlatforms = (floor, spriteVal, count) => {
  for(let i = 0; i < count; i++){
    group_platforms.push(floor.create(0, 0, spriteVal).setScale(1, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody());
  }
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