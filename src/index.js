import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const config = {
  type: Phaser.AUTO, // WebGL is default (Web graphics library - for rendering 2d and 3d graphics)
  ...SHARED_CONFIG, // separate shared config into the constant
  physics: {
    default: "arcade", // physics type
    arcade: {
      // gravity: { y: 400 },
      // this is gravity added for every object
      debug: true, // debugger
    },
  },
  scene: [new PlayScene(SHARED_CONFIG)],
  // add scenes to the array
};

new Phaser.Game(config);
// instanciate the game and pass the config
