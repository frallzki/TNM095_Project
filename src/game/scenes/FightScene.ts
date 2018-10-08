import { BlendModes, Scene } from 'phaser';

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

  public nextTurn() {
    this.index++;
    if (this.index >= this.units.length) {
      this.index = 0;
    }
    if (this.units[this.index]) {
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit('PlayerSelect', this.index);
      } else {
        let r = Mat.floor(Math.random() * this.heroes.length);
        this.units[this.index].attack(this.heroes[r]);
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  public receivePlayerSelection() {
    if (action == 'attack') {
      this.units[this.index].attack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  }

  public create(): void {
    console.debug('Create');
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');

    const warrior = new PlayerCharacter(this, 250, 50, 'player', 'FaceMan', 100, 20, null);
    this.add.existing(warrior);

    // const faceDude = new Enemy(this, 50, 50, 'enemy', null, 'faceDude', 50, 3);
    const faceDude = new Enemy(this, 50, 50, 'enemy', 'faceDude', 50, 3, null);
    this.add.existing(faceDude);

    this.heroes = [warrior];

    this.enemies = [faceDude];

    this.units = this.heroes.concat(this.enemies);

    // Run UI scene at the same time
    this.scene.launch('UIScene');

    this.index = -1;
  }

}

export class UIScene extends Phaser.Scene {

  public constructor() {
    super({ key: 'UIScene' });
  }

  public remapHeroes() {
    const heroes = this.battleScene.heroes;
    this.heroesMenu.reMap(heroes);
  }

  public remapEnemies() {
    const enemies = this.battleScene.enemies;
    this.enemyMenu.reMap(enemies);
  }

  public onKeyInput(event) {
    if (this.currentMenu) {
      if (event.code === "ArrowUp") {
        this.currentMenu.moveSelectionUp();
      } else if (event.code === "ArrowDown") {
        this.currentMenu.moveSelectionDown();
      } else if (event.code === "ArrowRight" || event.code === "Shift") {
      } else if (event.code === "Space" || event.code === "ArrowLeft") {
        this.curentMenu.confirm();
      }
    }
  }

  public onPlayerSelect(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  }

  public onSelectEnemies() {
    this.currentMenu = this.enemyMenu;
    this.enemyMenu.select(0);
  }

  public onEnemy() {
    this.heroesMenu.deselect();
    this.actionMenu.deselect();
    this.enemyMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
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

    // menu container
    this.menus = this.add.container();

    this.heroesMenu = new HeroMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemyMenu = new EnemyMenu(8, 153, this);

    // currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemyMenu);

    this.battleScene = this.scene.get('BattleScene');

    this.remapHeroes();
    this.remapEnemies();

    this.input.keyboard.on('keydown', this.onKeyInput, this);

    this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

    this.events.on("SelectEnemies", this.onSelectEnemies, this);

    this.events.on("Enemy", this.onEnemy, this);

    this.battleScene.nextTurn();
  }
}

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

  function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text,
    { color: '#ffffff', align: 'left', fontSize: 15 });
  },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff');
  }

});
/*
export class Menu extends Phaser.GameObjects.Container {
  public constructor(x, y, scene, heroes) {
    super(scene, x, y, heroes); // heroes?
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
  }

  public addMenuItem(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  }

  public moveSelectionUp() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;

    if (this.menuItemIndex < 0) {
      this.menuItemIndex = this.menuItems.length - 1;
    }
    this.menuItems[this.menuItemsIndex].select();
  }

  public moveSelectionDown() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;

    if (this.menuItemIndex >= this.menuItems.length) {
      this.menuItemIndex = 0;
    }
    this.menuItems[this.menuItemsIndex].select();
  }

  public select(index) {
    if (!index) {
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  }

  public deselect() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  }

  public confirm() {
    // when player selects, do the action
  }

  public clear() {
    for(let i =  0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  }

  public reMap(units) {
    this.clear();
    for(let i = 0; i < units.length; i++) {
      let unit = units[i];
      this.addMenuItem(unit.type);
    }
  }
}
*/
const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container, 

  initialize:

  function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.x = x;
    this.y = y;
  },

  addMenuItem: function(unit) {
    const menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
    this.menuItems.push(menuItem);
    this.add(menuItem);
  },

  moveSelectionUp: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex--;

    if (this.menuItemIndex < 0) {
      this.menuItemIndex = this.menuItems.length - 1;
    }
    this.menuItems[this.menuItemsIndex].select();
  },

  moveSelectionDown: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;

    if (this.menuItemIndex >= this.menuItems.length) {
      this.menuItemIndex = 0;
    }
    this.menuItems[this.menuItemsIndex].select();
  },

  select: function(index) {
    if (!index) {
      index = 0;
    }
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = index;
    this.menuItems[this.menuItemIndex].select();
  },

  deselect: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex = 0;
  },

  confirm: function() {
    // when player selects, do the action
  },

  clear: function() {
    for(let i =  0; i < this.menuItems.length; i++) {
      this.menuItems[i].destroy();
    }
    this.menuItems.length = 0;
    this.menuItemIndex = 0;
  },

  reMap: function(units) {
    this.clear();
    for(let i = 0; i < units.length; i++) {
      let unit = units[i];
      this.addMenuItem(unit.type);
    }
  }
});

export class HeroMenu extends Menu {
  public constructor(x, y, scene) {
    super(x, y, scene);
    Menu.call(this, x, y, scene);
  }
}

export class ActionsMenu extends Menu {
  public constructor(x, y, scene) {
    super(x, y, scene);
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
  }
  public confirm() {
    this.scene.events.emit('SelectEnemies');
    // do something when player selects an action
  }
}

export class EnemyMenu extends Menu {
  public constructor(x, y, scene) {
    super(x, y, scene);
    Menu.call(this, x, y, scene);
  }
  public confirm() {
    this.scene.events.emit("Enemy", this.menuItemIndex);
    // do something when player selects an enemy
  }
}
