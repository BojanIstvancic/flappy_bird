import Phaser from "phaser";

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  // create scene class
  constructor(config) {// pull the config - SHARED_CONFIG
    super("PlayScene");
    // define the name/key of the scene in constructor
    this.config = config; // put it into the config

    this.bird = null;
    this.pipes = null;

    this.pipeOpeningDistanceRange = [150, 250];
    this.pipeHorizontalDistanceRange = [300, 500];
    this.flapVelocity = 250;
  }

  preload() {
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

  create() {
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

    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird") // get birds position from config - pulled from shared config
      .setOrigin(0);

    /*
      sprite - game object - with multiple options
      physics - we must add physics if we want to apply physics to a bird (gravity, collision...)
    */

    this.bird.body.gravity.y = 400; // we added gravity only for bird

    /*
      add gravity - (speed on y axis with acceleration) and velocity (speed - no acceleration ) to each object separately
      bird.body.gravity.y = 200; // 200px / 1s, 400px / 2s, 600px - speed increases
      bird.body.velocity.y = 200; // 200px - speed
    */
    //  bird.body.velocity.x = FLAP_VELOCITY; // add X velocity - bird is moving left to right

    this.pipes = this.physics.add.group(); // create group - when we create the group we can apply some physics and functionalities to all of them

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      // generate series of pipes
      // const upperPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0, 1); // create 2 pipes with default position and pass them to the function
      // const lowerPipe = this.physics.add.sprite(0, 0, "pipe").setOrigin(0); - old way

      const upperPipe = this.pipes.create(0, 0, "pipe").setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, "pipe").setOrigin(0); // it will create dynamic sprite and add it in a group

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200); // give to all group -200 on X velocity

    this.input.on("pointerdown", this.flap, this);
    // we need to add third argument THIS so the function knows THIS.flap (THIS) refers to THIS context - context of THIS class not the other one
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  update(time, delta) {
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

    if (this.bird.y < 0) {
      // prevent bird from leaving the game on the top
      this.bird.y = 0;
    }

    if (this.bird.y > this.config.height) {
      // game lost if bird drops
      alert("lost");
      this.restartBirdPosition();
    }

    this.recyclePipes();
    // this funciton must be called here cause we want to check the position of the pipes for every frame
  }

  placePipe(uPipe, lPipe) {
    // define the pipes position

    const rightMostX = this.getRightMostPipe();

    const pipeOpeningDistance = Phaser.Math.Between(...this.pipeOpeningDistanceRange); // choses random value between two values
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeOpeningDistance
    ); // vertical position of the pipes
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...this.pipeHorizontalDistanceRange
    ); // pull random value between 300 and 500

    uPipe.x = rightMostX + pipeHorizontalDistance; //calculate horizontal position of the most right pipe and add to it random value so it is moved more to the right
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeOpeningDistance;

    // uPipe.body.velocity.x = -200; // move pipes horizontally from right to left
    // lPipe.body.velocity.x = -200; // we will add velocity to the group and that will apply to all pipes inside the group
  }

  recyclePipes() {
    // when the pipe pair goes out of the screen (left) place/reuse it as a last pipe pair

    const tempPipes = []; // create array which will hold 2 pipes when found
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        // if right side of the pipe is <= 0 on x axis - meaning if it just left the screen, then recycle it
        tempPipes.push(pipe);

        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes); // when we find both pipes we destructure the array and put these two values in our placePipe function
        }
      }
    });
  }

  getRightMostPipe() {
    // calculate CURRENT the most right pipe so we can add the horizontal distance dynamically
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      // pipes.getChildren() - get all pipes
      rightMostX = Math.max(pipe.x, rightMostX); // find the pipe which is currently the most right and return it's position
    });

    return rightMostX;
  }

  flap() {
    // move bird verticaly up
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  // restart the game and restart the bird position
  restartBirdPosition() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.body.velocity.y = 0;
  }
}

export default PlayScene;
