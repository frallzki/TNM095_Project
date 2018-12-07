import { BlendModes, Scene } from 'phaser';

export const MenuScene = new Phaser.Class({
 
  Extends: Phaser.Scene,

  initialize:

  function MenuScene ()
  {
      Phaser.Scene.call(this, { key: 'MenuScene' });
  },

  preload: function () {
    
    this.load.image('button', 'assets/HeroLix.png');
      
  },

  create: function () {
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    const button = this.add.text(135,110, 'Start', { fill: '#fff' });
    button.setInteractive();

    button.on('pointerdown', () => { this.scene.start('GameScene'); });
  }
});
