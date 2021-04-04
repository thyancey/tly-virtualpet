import Phaser from 'phaser';
import SpawnController from './spawn';
import SceneController from './scene';
import Events from './event-emitter';

let game;
let sceneContext;
let gameLoaded = false;
let activePetId = null;

export const createGame = (jsonData) => {
  console.log('Phaser.createGame, jsonData:', jsonData);

  const config = {
    type: Phaser.AUTO,
    scale:{
      parent: jsonData.id,
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 900,
      height: 500
    },
    autoRound: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true
        }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  global.game = new Phaser.Game(config);
}
global.stopGame = () => {
  sceneContext.scene.stop();
}

global.startGame = () => {
  sceneContext.scene.start();
}

export function updateBounds(x, y, width, height){
  sceneContext.physics.world.setBounds(x, y, width, height, true, true, true, true);
  sceneContext.cameras.main.setBounds(x, y, width, height, true, true, true, true);

  SceneController.updateBounds(x, y, width, height);
}

function setSceneContext(context){
  sceneContext = context;
  global.scene = sceneContext;
  SceneController.setContext(context);
  SpawnController.setContext(context);
}

function preload() {
  setSceneContext(this);
  SceneController.preload(this);
  SpawnController.preload(this);
}

export function alterPet(phaserPetDef){
  // console.log('Game.phaserPetDef: ', phaserPetDef);
  activePetId = phaserPetDef.id;
  SpawnController.alterPetInfo(phaserPetDef.id, phaserPetDef);

  if(gameLoaded){
    spawnPet(phaserPetDef.id);
  }
}

export function updateScene(sceneInfo){
  console.log('Game.updateScene: ', sceneInfo);
  SceneController.setSceneInfo(sceneInfo);
  global.sc = SceneController;
}

export function updatePetAnimationLabel(petId, data){
  SpawnController.updatePetAnimationLabel(petId, data);
}

export function updatePetActivities(petId, data){
  SpawnController.updatePetActivities(petId, data);
}

export function updatePetMortality(petId, isAlive){
  SpawnController.updatePetMortality(petId, isAlive);
}


export function spawnPet(petId){
  SpawnController.spawnPet(petId);
}

function onInterface(event, data){
  // console.log('onInterface', event, data)
  global.game.onInterface && global.game.onInterface(event, data)
}

function onSendStatus(data){
  // console.log('onInterface', event, data)
  global.game.onInterface && global.game.onInterface('sendStatus', data)
}

function create() {
  console.log('Phaser.create()')

  global.spawnController = SpawnController;

  let sceneGroups = SceneController.create(this);
  let spawnGroups = SpawnController.create(this);
  
  // this.physics.add.collider(spawnGroups.pets, [ sceneGroups.floor, sceneGroups.platforms ], null, collider_petsAndFloor, this);
  this.physics.add.collider(spawnGroups.pets, sceneGroups.floors, null, collider_petsAndFloors, this);
  this.physics.add.collider(spawnGroups.pets, sceneGroups.platforms, null, collider_petsAndPlatforms, this);
  
  spawnPet(activePetId);

  Events.on('interface', onInterface, this);
  Events.on('sendStatus', onSendStatus, this);

  gameLoaded = true;
}


function collider_petsAndFloors(pet, floors){
  return true;
}
function collider_petsAndPlatforms(pet, floors){
  return true;
  /*
  // to ignore floor when jumping or something
  if(pet.isGoingUp()){
    return false;
  }else{
    return true;
  }
  */
}

function update (){
  SpawnController.update();
}