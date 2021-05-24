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
            debug: false
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

global.spawnItem = () => {
  const coords = { 
    x: Math.random() * window.innerWidth, 
    y: 100
  };
  spawnItem('mushroom', coords);
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

export function alterItems(itemDefs){
  SpawnController.alterItemsInfo(itemDefs);
}

export function alterPet(phaserPetDef){
  activePetId = phaserPetDef.id;
  SpawnController.alterPetInfo(phaserPetDef.id, phaserPetDef);

  if(gameLoaded){
    spawnPet(phaserPetDef.id);
  }
}

export function updateScene(sceneInfo){
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

export function spawnItem(itemId, coords){
  console.log('Game.spawnItem', itemId, coords);
  SpawnController.spawnItemId(itemId, coords);
}

export function spawnPet(petId){
  console.log('Game.spawnPet');
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
  this.physics.add.collider(spawnGroups.pets, sceneGroups.floors, null, collider_thingsAndFloors, this);
  this.physics.add.collider(spawnGroups.pets, sceneGroups.platforms, null, collider_thingsAndPlatforms, this);
  this.physics.add.collider(spawnGroups.items, sceneGroups.floors, null, collider_thingsAndFloors, this);
  this.physics.add.collider(spawnGroups.items, sceneGroups.platforms, null, collider_thingsAndPlatforms, this);
  this.physics.add.collider(spawnGroups.items, spawnGroups.pets, null, collider_itemsAndPets, this);
  
  spawnPet(activePetId);

  Events.on('interface', onInterface, this);
  Events.on('sendStatus', onSendStatus, this);

  gameLoaded = true;
}

function collider_itemsAndPets(item, pet){
  const itemEffects = item.getItemEffects();
  pet.applyItemEffects(itemEffects);
  item.destroy();
  return false;
}

function collider_thingsAndFloors(itemOrPet, floors){
  return true;
}
function collider_thingsAndPlatforms(itemOrPet, floors){
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