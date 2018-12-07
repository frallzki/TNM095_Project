import { BlendModes } from 'phaser';

/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class GameScene extends Phaser.Scene {
  /**
   * Phaser preload method
   * Called before scene is created
   * @returns {void}
   */
  public preload(): void {
    console.debug('Preload');

    // this.load.image('face', 'assets/FaceMan.png');
    // this.load.setBaseURL('http://labs.phaser.io');
    // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    // this.load.image('red', 'assets/particles/red.png');
  }
  /**
   * Phaser create method
   * Initialize scene objects
   * @returns {void}
   */
  public create(): void {
    console.debug('Create');
    // this.mazeGraphics = this.add.graphics; ??

  }

    /*
    // Add particles with using asset "red"
    const particles = this.add.particles('red');

    // Create particle emitter
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: BlendModes.ADD
    });

    // Add logotype
    const logo = this.physics.add.image(512, 288, 'face');
    logo.setCollideWorldBounds(true);

    // Make particles follow the logotype
    emitter.startFollow(logo);
    */

}