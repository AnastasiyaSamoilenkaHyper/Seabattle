let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// An instance of a Phaser.Game object is assigned to a local variable called game and the configuration object is passed to it. This will start the process of bringing Phaser to life.
let game = new Phaser.Game(config);

function preload() {
  this.load.image("waves", "./assets/pattern.jpg");
  this.load.image("speaker", "./assets/speaker.png");
  this.load.image("ship1", "./assets/1_ship.png");
  this.load.image("ship2", "./assets/2_ship.png");
  this.load.image("flip_ship", "./assets/flip_ship.png");
  this.load.image("splash", "./assets/water_splash.png");
  this.load.image("flower", "./assets/flower.png");
  this.load.image("ship_with_flower", "./assets/2ship_with_flower.png");
  this.load.audio("sea", ["./assets/sea.mp3"]);
  this.load.audio("hit", ["./assets/hit.wav"]);
  this.load.audio("miss", ["./assets/miss.wav"]);
  this.load.audio("sad", ["./assets/sad.wav"]);
  this.load.image("red_particle", "assets/red_particle.png");

  this.load.audio("kids_cheering", "assets/kids_cheering.mp3");
  this.load.path = "assets/";
  this.load.multiatlas("firework", "fireworks.json");
  this.load.multiatlas("sceleton", "sceleton2.json");
}

let ships_config = [];
let splash_config = [];
let score = 0;
let scoreText;
let shotCounter = 0;
let attemptText;
let sea;
let hit;
let miss;
let newBackground;

function create() {
  //background
  let background = this.add.image(400, 300, "waves");
  background.displayWidth = 800;
  background.displayHeight = 600;
  let cell_size = 40;
  let cell_quantity = 10;
  let x_0 = 210;
  let y_0 = 120;
  let all = this;
  let scene = this;

  //Score
  scoreText = this.add.text(300, 70, `score: ${score} /16`, {
    fontSize: "32px",
    fill: "#000",
    backgroundColor: "#dffbff",
    fontFamily: "carino_sanssemibold",
  });

  //Attempts
  attemptText = this.add.text(265, 530, `attempts: ${shotCounter} /70`, {
    fontSize: "32px",
    fill: "#000",
    backgroundColor: "#dffbff",
    fontFamily: "carino_sanssemibold",
  });

  //Score text padding
  scoreText.setPadding({ x: 10, y: 5 });
  attemptText.setPadding({ x: 10, y: 5 });

  // grid
  let grid = this.add.grid(
    x_0 + (cell_size * cell_quantity) / 2, //x
    y_0 + (cell_size * cell_quantity) / 2, //y
    cell_size * cell_quantity, //width
    cell_size * cell_quantity, //height
    cell_size, //cellWidth
    cell_size, //cellHeight
    0xdffbff,
    1,
    0x000000,
    1
  );

  let ship1_y_size = 35;
  let splash_y_size = 60;
  let total_number_ships1 = 4;
  let total_number_splash = cell_quantity * cell_quantity;

  let count = 0;
  //////////////////////////SPLASHES////////////////////////////////////

  for (
    let splash_number = 0;
    splash_number < total_number_splash;
    splash_number++
  ) {
    let k = Phaser.Math.Between(0, cell_quantity - 1);
    let l = Phaser.Math.Between(0, cell_quantity - 1);
    while (splash_config.some((splash) => splash[0] == k && splash[1] == l)) {
      k = Phaser.Math.Between(0, cell_quantity - 1);
      l = Phaser.Math.Between(0, cell_quantity - 1);
    }
    splash_config.push([k, l]);

    let splash = this.add.sprite(
      x_0 + cell_size * (k + 0.5),
      y_0 + cell_size * (l + 0.5),
      "splash"
    );

    splash.setScale((0.9 * cell_size) / splash_y_size);
    splash.setInteractive();
    splash.input.hitArea.setTo(-2, -2, 55, 55);
    splash.alpha = 0.000001;

    let loserText;
    // let scene = this;

    splash.on("pointerdown", function () {
      miss = scene.sound.add("miss", { volume: 0.4 });
      miss.play();
      if (this.alpha != 1) {
        shotCounter++;
        this.alpha = 1;
        attemptText.setText("attempts: " + shotCounter + " /70");
      }
      if (shotCounter == 70) {
        setTimeout(() => {
          onEvent();
        }, 500);
        function onEvent() {
          newBackground = scene.add.image(400, 300, "waves");
          newBackground.displayWidth = 800;
          newBackground.displayHeight = 600;
          loserText = scene.add.text(
            60,
            300,
            "YOU LOST! ALL SHIPS ARE STILL FLOATING!",
            {
              fontSize: "32px",
              fill: "#000",
              backgroundColor: "#dffbff",
              fontFamily: "carino_sanssemibold",
            }
          );
          loserText.setPadding({ x: 15, y: 15 });
          addSceleton("sceleton", scene);
        }
      }
    });
  }

  //////////////////////////////1 CELL SHIP/////////////////////////////////////////
  doShips(
    4,
    cell_quantity,
    1, //LimitX
    1, // LimitY
    0, //checkI
    0, //checkY
    -7, //hitbox
    3,
    36,
    36, //hitbox
    cell_size,
    0.5, //flowerPositionI
    0.5, //flowerPositionY
    all,
    x_0,
    y_0,
    0.5, //spritePositionI
    0.5, // spritePositionY
    scene,
    "ship1",
    1, // howMuchLife
    0, // limitI
    0,
    0
  );

  //////////////////////////////2 CELL SHIP////////////////////////////////
  doShips(
    3,
    cell_quantity,
    1, //LimitX
    2, // LimitY
    0, //checkI
    1, //checkY
    -6, //hitbox
    0,
    39,
    80, //hitbox
    cell_size,
    0.5, //flowerPositionI
    0.5, //flowerPositionY
    all,
    x_0,
    y_0,
    0.5, //spritePositionI
    1, // spritePositionY
    scene,
    "ship2",
    2, // howMuchLife
    0, // limitI
    0,
    0
  );

  ////////////////////////////// FLIPPED 2 CELL SHIP/////////////////////
  doShips(
    3,
    cell_quantity,
    2, //LimitX
    1, // LimitY
    1, //checkI
    0, //checkY
    0, //hitbox
    -6,
    80,
    39,
    cell_size,
    0.5, //flowerPositionI
    0.5, //flowerPositionY
    all,
    x_0,
    y_0,
    1, //spritePositionI
    0.5, // spritePositionY
    scene,
    "flip_ship",
    2, // howMuchLife
    1, // LimitI
    1, //Ifrom
    0 //Jfrom
  );
}

// SCELETON FUNCTION
function addSceleton(sceleton, scene) {
  let framesArray = [];
  for (let num = 0; num < 12; num++) {
    framesArray.push({
      key: sceleton,
      frame: "sceleton/death_00" + num + ".png",
    });
  }
  scene.anims.create({
    key: sceleton,
    frames: framesArray,
    frameRate: 10,
    repeat: -1,
  });
  let sad;
  sad = scene.sound.add("sad", { volume: 0.4 });
  sad.play();
  scene.add.sprite(475, 470, "sceleton").play("sceleton").setScale(0.3, 0.3);
}

//Fireworks function
function addFireworks(firework, scene) {
  let framesArray = [];
  for (let num = 0; num < 27; num++) {
    framesArray.push({
      key: firework,
      frame: "New-folder/firework-" + num.toString(),
    });
  }
  scene.anims.create({
    key: "firework",
    frames: framesArray,
    frameRate: 20,
    repeat: -1,
  });
  setTimeout(() => {
    let cheer;
    cheer = scene.sound.add("kids_cheering", { volume: 0.4 });
    cheer.play();
    doFirework(200, 200, "firework", 2);
  }, 500);
  setTimeout(() => {
    doFirework(400, 500, "firework", 1);
  }, 700);
  setTimeout(() => {
    doFirework(600, 250, "firework", 1.5);
  }, 800);

  function doFirework(x, y, spriteName, scale) {
    scene.add
      .sprite(x, y, spriteName)
      .play(spriteName, true)
      .setScale(scale, scale);
  }
}

//function doShips
function doShips(
  shipQuantity,
  cell_quantity,
  limitX,
  limitY,
  checkI,
  checkY,
  hitbox1,
  hitbox2,
  hitbox3,
  hitbox4,
  cell_size,
  flowerPositionI,
  flowerPositionY,
  all,
  x_0,
  y_0,
  spritePositionI,
  spritePositionY,
  scene,
  shipName,
  howMuchLife,
  limitI,
  IFrom,
  JFrom
) {
  for (
    let ship_number = 0;
    ship_number < shipQuantity;
    ship_number++, spritePositionI, spritePositionY
  ) {
    let i = Phaser.Math.Between(IFrom, cell_quantity - limitX);
    let j = Phaser.Math.Between(JFrom, cell_quantity - limitY);

    while (
      ships_config.some(
        (ship) =>
          (ship[0] == i && ship[1] == j) ||
          (ship[0] == i + checkI && ship[1] == j + checkY)
      )
    ) {
      i = Phaser.Math.Between(IFrom, cell_quantity - limitX);
      j = Phaser.Math.Between(JFrom, cell_quantity - limitY);
    }

    ships_config.push([i, j]);
    ships_config.push([i, j + checkY]);

    let ship2 = all.add.sprite(
      x_0 + cell_size * (i + spritePositionI),
      y_0 + cell_size * (j + spritePositionY),
      shipName
    );

    ship2.alpha = 0.000001;
    ship2.setInteractive();
    ship2.input.hitArea.setTo(hitbox1, hitbox2, hitbox3, hitbox4);
    // scene.input.enableDebug(ship2);

    let winnerText;
    ship2.state = howMuchLife;

    ship2.on("pointerdown", function () {
      hit = scene.sound.add("hit", { volume: 0.4 });
      hit.play({
        seek: 2.55,
      });

      if (this.alpha != 1) {
        score++;
        this.state--;

        let i = Math.floor((scene.input.activePointer.x - x_0) / cell_size);
        let j = Math.floor((scene.input.activePointer.y - y_0) / cell_size);

        ///////////////////////////FLOWER//////////////////////////////////

        let flower = scene.add.sprite(
          x_0 + cell_size * (i + flowerPositionI),
          y_0 + cell_size * (j + flowerPositionY),
          "flower"
        );

        flower.setInteractive();

        if (this.state == 0) {
          this.alpha = 1;
        }
        //SCORE TEXT APPENDED TO THE PAGE
        scoreText.setText("score: " + score + " /16");
        // TIMER
        if (score == 16) {
          setTimeout(() => {
            winnerScenario(scene, winnerText);
          }, 1000);
        }
      }
    });
  }
}

function winnerScenario(scene, winnerText) {
  let newBackground = scene.add.image(400, 300, "waves");
  newBackground.displayWidth = 800;
  newBackground.displayHeight = 600;
  winnerText = scene.add.text(100, 300, "YOU WON! ALL SHIPS ARE DEFEATED!", {
    fontSize: "32px",
    fill: "#000",
    backgroundColor: "#dffbff",
    fontFamily: "carino_sanssemibold",
  });
  winnerText.setPadding({ x: 15, y: 15 });
  addFireworks("firework", scene);
}
