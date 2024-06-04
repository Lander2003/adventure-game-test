import './style.css'
import Phaser from "phaser";

const sizes = {
  width: 1200,
  height: 700
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.background;
    this.player;
    this.cursor;
    this.mainTheme;
    this.jump;
    this.coinCollected;
    this.diamond;
  }

  preload() {
    this.load.image("mainBg", "assets/backgrounds/1200x750/forest.png");
    this.load.image("secondBg", "assets/backgrounds/dark-forest.png");
    this.load.audio("theme", "assets/sounds/main-theme.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("coinCollected", "assets/sounds/coinCollected.wav");

    this.load.spritesheet("playerIdle", "assets/Owlet_Monster/Owlet_Monster_Idle_4.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("playerWalk", "assets/Owlet_Monster/Owlet_Monster_Walk_6.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("playerRun", "assets/Owlet_Monster/Owlet_Monster_Run_6.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("playerJump", "assets/Owlet_Monster/Owlet_Monster_Jump_8.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("diamond", "assets/collectables/diamond.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.background = this.add.image(0, 0, "mainBg").setOrigin(0, 0).setDisplaySize(sizes.width, sizes.height);
    this.player = this.physics.add.sprite(0, sizes.height - 100, "playerIdle").setOrigin(0, 0);
    this.player.setScale(2);
    this.player.setSize(32, 50).setOffset(0, 5);
    this.player.setCollideWorldBounds(true);

    this.diamond = this.physics.add.sprite(sizes.width / 2, 550, "diamond").setOrigin(0.5, 0.5);
    this.diamond.setImmovable(true);
    this.diamond.body.setAllowGravity(false);
    this.diamond.setCollideWorldBounds(true);
    this.diamond.setScale(1.5);

    this.physics.add.overlap(this.player, this.diamond, this.collectDiamond, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.mainTheme = this.sound.add("theme");
    this.mainTheme.play();

    this.coinCollected = this.sound.add("coinCollected");
    this.jump = this.sound.add("jump");

    this.add.text(470, 100, 'Main Menu', {
      fontFamily: 'cursive',
      fontSize: '50px',
      color: '#a1f7ac',
      align: 'center',
      stroke: '#292929',
      strokeThickness: 5,
      shadow: {
        offsetX: 0.5,
        offsetY: 0.5,
        color: '#333333',
        blur: 0,
        fill: true
      }
    });

    this.add.text(370, 250, 'Collect the Diamond to START!', {
      fontFamily: 'cursive',
      fontSize: '30px',
      color: '#a1f7ac',
      align: 'center',
      stroke: '#292929',
      strokeThickness: 5,
      shadow: {
        offsetX: 0.5,
        offsetY: 0.5,
        color: '#333333',
        blur: 0,
        fill: true
      }
    });

    this.anims.create({
      key: 'player_idle',
      frames: this.anims.generateFrameNumbers('playerIdle'),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('playerWalk'),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'player_run',
      frames: this.anims.generateFrameNumbers('playerRun'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'player_jump',
      frames: this.anims.generateFrameNumbers('playerJump'),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'diamond_animation',
      frames: this.anims.generateFrameNumbers('diamond'),
      frameRate: 6,
      repeat: -1
    });

    this.diamond.play("diamond_animation", true);
  }

  update() {
    const { left, right, up, shift } = this.cursor;

    if (left.isDown) {
      this.player.flipX = true;
      if (shift.isDown) {
        this.player.play('player_run', true);
        this.player.setVelocityX(-240);
      } else {
        this.player.setVelocityX(-150);
        this.player.play('player_walk', true);
      }
    } else if (right.isDown) {
      this.player.flipX = false;
      if (shift.isDown) {
        this.player.play('player_run', true);
        this.player.setVelocityX(240);
      } else {
        this.player.setVelocityX(150);
        this.player.play('player_walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.play('player_idle', true);
    }

    if (up.isDown) {
      if (!this.player.body.onFloor()) { return; }
      this.player.setVelocityY(-360);
      this.jump.play();
    }

    this.diamond.play("diamond_animation", true);
  }

  collectDiamond(player, diamond) {
    diamond.disableBody(true, true);
    this.coinCollected.play();
    this.scene.start('scene-monologue');
  }
}

class MonologueScene extends Phaser.Scene {
  constructor() {
    super("scene-monologue");
    this.player;
    this.jump;
    this.coinCollected;
    this.background;
    this.cursor;
    this.monologueTexts = [
      "Use arrow keys to move left and right.",
      "Hold shift to run.",
      "Press the up arrow key to jump."
    ];
    this.currentTextIndex = 0;
    this.textDisplay;
    this.diamond;
  }

  preload() {
    this.load.image("secondBg", "assets/backgrounds/dark-forest.png");
    this.load.image("diamond", "assets/collectables/diamond.png");
    this.load.audio("theme", "assets/sounds/main-theme.mp3");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("coinCollected", "assets/sounds/coinCollected.wav");
    this.load.spritesheet("playerIdle", "assets/Owlet_Monster/Owlet_Monster_Idle_4.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("playerWalk", "assets/Owlet_Monster/Owlet_Monster_Walk_6.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("playerRun", "assets/Owlet_Monster/Owlet_Monster_Run_6.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("playerJump", "assets/Owlet_Monster/Owlet_Monster_Jump_8.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.background = this.add.tileSprite(600, 350, 1200, 700, "secondBg");
    // // this.physics.world.setBounds(0, 0, 1200, 700);
    // let camera = this.cameras.main;
    // camera.setBounds(0, 0, 1200, 700);
    // camera.startFollow(player, true, 0.05, 0, -200, 120);
    this.coinCollected = this.sound.add("coinCollected");
    this.jump = this.sound.add("jump");

    this.player = this.physics.add.sprite(100, sizes.height - 100, "playerIdle").setOrigin(0, 0);
    this.player.setScale(2);
    this.player.setSize(32, 50).setOffset(0, 5);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.ground);

    // this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    // this.cameras.main.startFollow(this.player);

    this.textDisplay = this.add.text(sizes.width / 2, sizes.height / 2, this.monologueTexts[this.currentTextIndex], {
      fontFamily: 'cursive',
      fontSize: '25px', // Increased font size
      color: '#ffffff',
      align: 'center',
      stroke: '#292929',
      strokeThickness: 5,
      shadow: {
        offsetX: 0.5,
        offsetY: 0.5,
        color: '#333333',
        blur: 0,
        fill: true
      }
    }).setOrigin(0.5, 0.5);



    this.time.addEvent({
      delay: 3000,
      callback: this.nextMonologueText,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 9000,
      callback: this.spawnDiamond,
      callbackScope: this,
      loop: false
    });

    this.anims.create({
      key: 'player_idle',
      frames: this.anims.generateFrameNumbers('playerIdle'),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('playerWalk'),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'player_run',
      frames: this.anims.generateFrameNumbers('playerRun'),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'player_jump',
      frames: this.anims.generateFrameNumbers('playerJump'),
      frameRate: 15,
      repeat: -1
    });

    this.cursor = this.input.keyboard.createCursorKeys();
    this.player.play('player_idle', true);


  }

  update() {

    const { left, right, up, shift } = this.cursor;
    let scrol_x = this.player.x - game.config.width/2;
    let scrol_y = 0;

     // this.cameras.main.scrollX = scrol_x;    ///  scrollX - Х top left point of camera
     // this.cameras.main.scrollY = scrol_y;
     // this.cameras.main.setZoom(1, 1);

    if (left.isDown) {
      this.player.flipX = true;
      this.background.tilePositionX -= 1;
      if (shift.isDown) {
        this.player.play('player_run', true);
        this.player.setVelocityX(-240);
        this.background.tilePositionX -= 1.5;
      } else {
        this.player.setVelocityX(-150);
        this.player.play('player_walk', true);
      }
    } else if (right.isDown) {
      this.player.flipX = false;
      this.background.tilePositionX += 1;
      if (shift.isDown) {
        this.player.play('player_run', true);
        this.player.setVelocityX(240);
        this.background.tilePositionX += 1.5;
      } else {
        this.player.setVelocityX(150);
        this.player.play('player_walk', true);
      }
    } else {
      this.player.setVelocityX(0);
      this.player.play('player_idle', true);
    }

    if (up.isDown) {
      if (!this.player.body.onFloor()) { return; }
      this.jump.play();
      this.player.setVelocityY(-360);
    }
  }

  nextMonologueText() {
    this.currentTextIndex++;
    if (this.currentTextIndex < this.monologueTexts.length) {
      this.textDisplay.setText(this.monologueTexts[this.currentTextIndex]);
    } else {
      this.textDisplay.setText('Collect the diamond to continue...');
    }
  }
  spawnDiamond() {
    this.diamond = this.physics.add.sprite(sizes.width / 2, 500, "diamond").setOrigin(0.5, 0.5);
    // this.diamond.setCollideWorldBounds(true);
    this.diamond.setImmovable(true);
    this.diamond.body.setAllowGravity(false);
    this.diamond.setScale(1.5);
    this.physics.add.overlap(this.player, this.diamond, this.collectDiamond, null, this);

    this.anims.create({
      key: 'diamond_animation',
      frames: this.anims.generateFrameNumbers('diamond'),
      frameRate: 6,
      repeat: -1
    });

    this.diamond.play("diamond_animation", true);
  }

  collectDiamond(player, diamond) {
    diamond.disableBody(true, true);
    this.coinCollected.play();
    // this.scene.start('scene-next'); // Adjust this to the correct next scene
    console.log("Collected");
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: document.getElementById('gameCanvas'),
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 700 },
      debug: false
    }
  },
  scene: [GameScene, MonologueScene]
};

const game = new Phaser.Game(config);
