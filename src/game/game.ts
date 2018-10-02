import Phaser from 'phaser';
import { phaserConfig } from '@/config';

export default class Game extends Phaser.Game {
  /**
   * Create phaser game
   */
  public constructor() {
    // Run parent constuctor test
    super(phaserConfig);
  }
}