import { GameScene } from '@/scenes/GameScene';

/**
 * Phaser game config
 */
export const phaserConfig: GameConfig = {
  parent: 'app',
  type: Phaser.AUTO,
  scene: [GameScene],
  width: 1024,
  height: 576,

  // Sample config items
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },
};