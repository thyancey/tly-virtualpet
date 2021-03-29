import Phaser from 'phaser';
import SpawnController from './spawn.js';

let game;
let sceneContext;

export const createGame = (jsonData) => {
  console.log('Phaser.createGame, jsonData:', jsonData);

  // SpawnController.setDefinitions([
  //   {
  //     id: 'bario'
  //   }
  // ]);

  const config = {
    type: Phaser.AUTO,
    scale:{
      parent: jsonData.id,
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 900,
      height: 500,
    },
    autoRound: false,
    backgroundColor: 0xFF0000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };

  game = new Phaser.Game(config);
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
  SpawnController.setContext(context);
}

function preload() {
  setSceneContext(this);
  SpawnController.preload(this);
}

export function updatePet(petInfo){
  console.log('Game.updatePet: ', petInfo);
  SpawnController.setPetInfo(petInfo.id, petInfo);
}

export function updatePetAnimationLabel(petId, animationLabel){
  // console.log('updatePetAnimationLabel: ', animationLabel);
  SpawnController.updatePetAnimationLabel(petId, animationLabel);
}

export function spawnPet(){
  SpawnController.spawnPet('bario')
}

function create() {
  console.log('Phaser.create()')

  global.spawnController = SpawnController;

  let spawnGroups = SpawnController.create(this);
  spawnPet();
}

function update (){
  SpawnController.update();
}