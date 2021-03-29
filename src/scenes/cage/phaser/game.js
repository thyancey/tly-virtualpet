import Phaser from 'phaser';

let game;
let enemies;
let platforms;
let emitter;
let sceneContext;

export const createGame = (jsonData) =>{
  console.log('jsonData is ', jsonData);
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
  // LevelController.setContext(context);
  // SpawnController.setContext(context);
}

function preload() {
  setSceneContext(this);
  
  // this.load.image('blood', img_blood);
  // LevelController.preload();
  // SpawnController.preload();

  this.load.setBaseURL('http://labs.phaser.io');

  this.load.image('sky', 'assets/skies/space3.png');
  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');

  
}

function create() {
  this.add.image(400, 300, 'sky');

  var particles = this.add.particles('red');

  var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
  });

  var logo = this.physics.add.image(400, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);



  //- make the level
  // platforms = LevelController.create();
  
  //- make the enemies
  // let spawnGroups = SpawnController.create(this, enemies);

  // this.physics.add.collider(spawnGroups.enemies, platforms);
  // this.physics.add.collider(spawnGroups.items, platforms);
  // this.physics.add.overlap(spawnGroups.enemies, spawnGroups.items, touchItem, null, this);

  // this.input.on('gameobjectdown', onObjectClicked);
  // this.input.on('pointerdown', onSceneClicked);

  // setupMouseEmitter();
}

function update (){
  // SpawnController.update();
}