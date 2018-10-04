import { GameScene } from '@/scenes/GameScene';
import { FightScene, BattleScene, UIScene } from '@/scenes/FightScene';

/**
 * Phaser game config
 */
export const phaserConfig: GameConfig = {
  parent: 'app', // content??
  type: Phaser.AUTO, // AUTO
  scene: [FightScene, BattleScene, UIScene], // GameScene
  width: 320, // 1024
  height: 240, // 576
  zoom: 2,

  // Sample config items
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
};