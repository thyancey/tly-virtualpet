

import { getValOrRandRange, randBetween } from "@util/tools";

export const stretchBgToBounds = (globalBg, sceneInfo, gameBounds) => {
  const bg = sceneInfo.background;

  globalBg.width = bg.size[0];
  globalBg.height = bg.size[0];

  if(bg.scale.width === 'stretch'){
    globalBg.displayWidth = gameBounds.w;
  } else if(bg.scale.width === 'auto'){
    globalBg.displayWidth = bg.size[0] * (bg.spriteScale || 1);
  }

  if(bg.scale.height === 'stretch'){
    globalBg.displayHeight = gameBounds.h;
  } else if(bg.scale.height === 'auto'){
    globalBg.displayHeight = bg.size[1] * (bg.spriteScale || 1);
  }

  //diff between image and page height
  let diff = globalBg.displayHeight - gameBounds.h;
  globalBg.y = -diff;
  
  // just make em big, 1000 isnt pixels here though need to figure out what it is
  globalBg.width = 1000;
  globalBg.height = 1000;

  return globalBg;
}

export const positionFloor = (group, sceneInfo, gameBounds) => {
  let floorY = gameBounds.h - sceneInfo.floor.height;

  setPlatformToPosition(group[0].body, group[0].texture, {
    x: 0,
    y: floorY,
    w: gameBounds.w,
    h: sceneInfo.floor.height,
  });
}

export const positionPlatforms = (group, sceneInfo, gameBounds) => {
  let floorY = gameBounds.h - sceneInfo.floor.height;

  group.forEach((pGroup, p) => {
    let pParams = sceneInfo.platforms[p];
    
    if(pParams.type === 'rando'){
      positionPlatformGroup_rando(pGroup, pParams, floorY, gameBounds.w)
    }else if(pParams.type === 'stairs'){
      positionPlatformGroup_stairs(pGroup, pParams, floorY, gameBounds.w)
    } else{
      console.log('invalid type ', pParams.type)
    }
  })
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