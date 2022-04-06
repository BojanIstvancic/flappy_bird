import Phaser from "phaser";

const config = {
  // define the config
  type: Phaser.AUTO, // WebGL is default (Web graphics library - for rendering 2d and 3d graphics)
  width: 800,
  height: 600,
  physics: {
    default: "arcade", // physics type
    arcade: {
      // gravity: { y: 400 },
      // this is gravity added for every object
      debug: true, // debugger
    },
  },
  scene: {
    // scene functions, we must follow this order
    preload,
    create,
    update,
  },
};

let bird = null;
const FLAP_VELOCITY = 250; // bird vertical speed
const initialBirdPosition = { x: config.width / 10, y: config.height / 2 }; // initial birds position

let pipes = null;
const PIPES_TO_RENDER = 4;
const pipeOpeningDistanceRange = [150, 250];
let pipeHorizontalDistance = 0;

function preload() {
  // loading assets, images, music, animations...
  // 'this' contexts - contains functions and properties we can use

  this.load.image("sky", "assets/sky.png");
  /*
    load image 
    [1] is key / identifier
    [2] location where it is
  */
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  // initialize the application

  // this.add.image(config.width / 2, config.height / 2, "sky");
  this.add.image(0, 0, "sky").setOrigin(0);
  /* 
    Add the image to the application (we are positioning center of the image to the center of the app)
    [1] - x position - of the canvas
    [2] - y position - of the canvas
    [3] - key of the image

    setOrigin(0, 0) - change origin of an image - top left (x = 0, y = 0)
  */

  bird = this.physics.add
    .sprite(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);

  /*
    sprite - game object - with multiple options
    physics - we must add physics if we want to apply physics to a bird (gravity, collision...)
  */

  bird.body.gravity.y = 200; // we added gravity only for bird

  /*
    add gravity - (speed on y axis with acceleration) and velocity (speed - no acceleration ) to each object separately
    bird.body.gravity.y = 200; // 200px / 1s, 400px / 2s, 600px - speed increases
    bird.body.velocity.y = 200; // 200px - speed
  */
  //  bird.body.velocity.x = FLAP_VELOCITY; // add X velocity - bird is moving left to right

  pipes = this.physics.add.group(); // create group - when we create the group we can apply some physics and functionalities to all of them

  for (let i = 0; i < PIPES_TO_RENDER; i++) {
    // generate series of pipes
    // const upperPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 1); // create 2 pipes with default position and pass them to the function
    // const lowerPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0); - old way

    const upperPipe = pipes.create(0, 0, "pipe").setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, "pipe").setOrigin(0); // it will create dynamic sprite and add it in a group

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200); // give to all group -200 on X velocity

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
}

function update(time, delta) {
  /*
    update like timeInterval - updates every frame default (60ps)
    [1] - delta - time from an last frame (16ms - 1000 / 60)
    [2] - time - total time
  */
  /*
  if (bird.x >= config.width - bird.width) {
    bird.body.velocity.x = -FLAP_VELOCITY;
  } else if (bird.x <= 0) {
    bird.body.velocity.x = FLAP_VELOCITY;
  }
  // example function if we want to move the sprite
  */

  if (bird.y < 0) {
    // prevent bird from leaving the game on the top
    bird.y = 0;
  }

  if (bird.y > config.height) {
    // game lost if bird drops
    alert("lost");
    restartBirdPosition();
  }
}

// creating custom function for gameplay

function flap() {
  // move bird verticaly up
  bird.body.velocity.y = -FLAP_VELOCITY;
}

// restart the game and restart the bird position
function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function placePipe(uPipe, lPipe) {
  // define the pipes position
  pipeHorizontalDistance += 400;

  let pipeOpeningDistance = Phaser.Math.Between(...pipeOpeningDistanceRange); // choses random value between two values
  let pipeVerticalPosition = Phaser.Math.Between(
    20,
    config.height - 20 - pipeOpeningDistance
  ); // vertical position of the pipes

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeOpeningDistance;

  // uPipe.body.velocity.x = -200; // move pipes horizontally from right to left
  // lPipe.body.velocity.x = -200; // we will add velocity to the group and that will apply to all pipes inside the group
}

new Phaser.Game(config);
// instanciate the game and pass the config
