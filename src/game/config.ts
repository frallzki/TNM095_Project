import { GameScene } from '@/scenes/GameScene';
import { FightScene, BattleScene, UIScene, EnemyAI } from '@/scenes/FightScene';
//import { EnemyAI } from '@/scenes/BehaviouTree';

/**
 * Phaser game config
 */
export const phaserConfig: GameConfig = {
  parent: 'app', // content??
  type: Phaser.AUTO, // AUTO
  scene: [FightScene, BattleScene, UIScene, EnemyAI], // GameScene
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