import { BlendModes } from 'phaser';

/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */

export class Unit extends Phaser.GameObjects.Sprite {

  public constructor(x, y, texture, frame, type, hp, damage) {
    super(x, y, texture, frame, type, hp, damage);
    // Phaser.GameObjects.Sprite.call(this, this.scene, x, y, texture, frame);
    this.type = type;
    this.maxHp = this.hp = hp;
    this.damage = damage; // default damage
  }

  public attack(target:number): void { // number???
    target.takeDamage(this.damage);
  }
  public takeDamage(damage:number): void {
    this.hp -= damage;
  }

}

export class Enemy extends Unit {
  public constructor(scene, x, y, texture, frame, type, hp, damage) {
    // Unit.call(this, scene, x, y, texture, frame, type, hp, damage);

    super(scene, x, y, texture, frame, type, hp, damage);
  }
}

export class PlayerCharacter extends Unit {
  public constructor(scene, x, y, texture, frame, type, hp, damage) {
    // Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    // glöm inte att flippa sprite osv
    // this.flipX = true;
    // this.setScale(2);
    super(scene, x, y, texture, frame, type, hp, damage);
  }
}

export class FightScene extends Phaser.Scene {
  /**
   * Phaser preload method
   * Called before scene is created
   * @returns {void}
   */
  public preload(): void {
    console.debug('Preload');
    this.load.image('player', 'assets/FaceMan.png');
    this.load.image('enemy', 'assets/FaceDude.png');

    // Fixa lite nice sprites
    // player enemy osv
  }

  public constructor() {
    super({ key: 'FightScene' });
    // Phaser.Scene.call(this, { key: 'Fightscene' });

  }

  /**
   * Phaser create method
   * Initialize scene objects
   * @returns {void}
   */

  public create(): void {
    console.debug('Create');

    this.scene.start('BattleScene');
  }
}

export class BattleScene extends Phaser.Scene {

  public constructor() {
    super({ key: 'BattleScene' });
    // Phaser.Scene.call(this, { key: 'BattleScene' });

    // super();
  }

  public create(): void {
    console.debug('Create');
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    const warrior = new PlayerCharacter(this, 250, 50, 'player', null, 'warrior', 100, 20);
    this.add.existing(warrior);

    const faceDude = new Enemy(this, 50, 50, 'enemy', null, 'faceDude', 50, 3);
    this.add.existing(faceDude);

    this.heroes = [warrior];

    this.enemies = [faceDude];

    this.units = this.heroes.concat(this.enemies);

    // Run UI scene at the same time
    this.scene.launch('UIScene');
  }

}

export class UIScene extends Phaser.Scene {

  public constructor() {
    super({ key: 'UIScene' });
  }

  public create(): void {
    console.debug('Create');

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.fillStyle(0x031f4c, 1);
    this.graphics.strokeRect(2, 150, 90, 100);
    this.graphics.fillRect(2, 150, 90, 100);
    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);

  }
}