import { BlendModes } from 'phaser';

/**
 * Sample Phaser scene
 * @extends {Phaser.Scene}
 */
export class FightScene extends Phaser.Scene {
  /**
   * Phaser preload method
   * Called before scene is created
   * @returns {void}
   */
  public preload(): void {
    console.debug('Preload');
    // Fixa lite nice sprites
    // player enemy osv
  }

  public constructor() {
    super({ key: 'FightScene' });
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
  }

  public create(): void {
    console.debug('Create');

    this.scene.launch('UIScene');

    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
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