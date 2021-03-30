let sceneContext;
const DEBUG_ALPHA = .5;
let gSceneInfo = {};

const setContext = (context) => {
  sceneContext = context;
}

const preload = () => {
}

const create = (levelData) => {
  const floor = sceneContext.physics.add.staticGroup();
  
  // let spriteVal = 'some-sprite';
  let spriteVal = null;

  let floorY = global.innerHeight - gSceneInfo.floor.height;
  floor.create(0, floorY, spriteVal).setScale(50, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();

  makeStairs(floor, floorY, spriteVal)

  return {
    floor
  }
}

const makeStairs = (floor, floorY, spriteVal) => {
  let fourthW = global.innerWidth / 4;
  let stepSize = 30;
  floor.create(fourthW, floorY - stepSize, spriteVal).setScale(25, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
  floor.create(fourthW * 2, floorY - stepSize * 2, spriteVal).setScale(25, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
  floor.create(fourthW * 3, floorY - stepSize * 3, spriteVal).setScale(25, 1).setOrigin(0,0).setAlpha(DEBUG_ALPHA).refreshBody();
}


const setSceneInfo = sceneInfo => {
  gSceneInfo = sceneInfo;
}

const exports = {
  setContext,
  preload,
  create,
  setSceneInfo
}

export default exports;