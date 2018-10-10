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
        let r = Math.floor(Math.random() * this.heroes.length);
        this.units[this.index].attack(this.heroes[r]);
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
      }
    }
  }

  public receivePlayerSelection(action, target) {
    if (action == 'Attack') {
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
        this.currentMenu.confirm();
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

  public onEnemy(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemyMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('Attack', index);
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
    Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
  },

  select: function () {
    this.setColor('#f8ff38');
  },

  deselect: function () {
    this.setColor('#ffffff');
  }

});

const Menu = new Phaser.Class({
  Extends: Phaser.GameObjects.Container, 

  initialize:

  function Menu(x, y, scene, heroes) {
    Phaser.GameObjects.Container.call(this, scene, x, y);
    this.menuItems = [];
    this.menuItemIndex = 0;
    this.heroes = heroes;
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

/*
 Try to change these menues :'(
*/

const HeroMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function HeroMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  }
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function ActionsMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
    this.addMenuItem('Heal');

  },
  confirm: function() {
    this.scene.events.emit('SelectEnemies');
  }
});

const EnemyMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function EnemyMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm: function() {
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
});

const Message = new Phaser.Class({

  Extends: Phaser.GameObjects.Container,

  initialize:
  function Message(scene, events) {
    Phaser.GameObjects.Container.call(this, scene, 160, 30);
    var graphics = this.scene.add.graphics();
    this.add(graphics);
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.fillStyle(0x031f4c, 0.3);        
    graphics.strokeRect(-90, -15, 180, 30);
    graphics.fillRect(-90, -15, 180, 30);
    this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", { color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width: 160, useAdvancedWrap: true }});
    this.add(this.text);
    this.text.setOrigin(0.5);        
    events.on("Message", this.showMessage, this);
    this.visible = false;
  },
  showMessage: function(text) {
    this.text.setText(text);
    this.visible = true;
    if(this.hideEvent)
        this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
},
  hideMessage: function() {
    this.hideEvent = null;
    this.visible = false;
}
});

/*
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
*/