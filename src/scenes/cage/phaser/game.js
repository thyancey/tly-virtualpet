import Phaser from 'phaser';
import SpawnController from './spawn.js';
import SceneController from './scene.js';
import Events from './event-emitter';

let game;
let sceneContext;
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

export function updatePet(petInfo){
  console.log('Game.updatePet: ', petInfo);
  activePetId = petInfo.id;
  SpawnController.setPetInfo(petInfo.id, petInfo);
}

export function updateScene(sceneInfo){
  console.log('Game.updateScene: ', sceneInfo);
  SceneController.setSceneInfo(sceneInfo);
}

export function updatePetAnimationLabel(petId, data){
  SpawnController.updatePetAnimationLabel(petId, data);
}

export function updatePetActivities(petId, data){
  SpawnController.updatePetActivities(petId, data);
}


export function spawnPet(){
  SpawnController.spawnPet(activePetId);
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
  
  this.physics.add.collider(spawnGroups.pets, sceneGroups.floor, null, collider_petsAndFloor, this);
  
  spawnPet();

  Events.on('interface', onInterface, this);
  Events.on('sendStatus', onSendStatus, this);
}


function collider_petsAndFloor(pet, floor){
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