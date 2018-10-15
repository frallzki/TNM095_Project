import { BlendModes, Scene } from 'phaser';
import {BehaviorTreeBuilder, BehaviorTreeStatus, TimeData} from "fluent-behavior-tree";
// import BehaviorTree, {Sequence, Task, SUCCESS, FAILURE }  from 'behaviortree';
// const BehaviorTree = require('behaviortree');
// const { Sequence, Task, SUCCESS, FAILURE } = BehaviorTree;
require("babel-core/register");
require("babel-polyfill");

export const FightScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize:

  function FightScene() {
    Phaser.Scene.call(this, { key: 'FightScene' });
  },

  preload: function() {
    console.debug('Preload');
    /*
    this.load.image('hero1', 'assets/HeroFrall.png');
    this.load.image('hero2', 'assets/HeroLix.png');
    this.load.image('enemy1', 'assets/enmyTard.png');
    this.load.image('enemy2', 'assets/enmySpooks.png');
    */
    this.load.spritesheet('hero1_frames', 'assets/HeroFrall_frames.png', {
      frameWidth: 96, 
      frameHeight: 84});
    this.load.spritesheet('hero2_frames', 'assets/HeroLix_frames.png', {
      frameWidth: 96, 
      frameHeight: 84});
    this.load.spritesheet('enemy1_frames', 'assets/enmyTard_frames.png', {
      frameWidth: 96, 
      frameHeight: 84});
    this.load.spritesheet('enemy2_frames', 'assets/enmySpooks_frames.png', {
      frameWidth: 96, 
      frameHeight: 84});
  },

  create: function() {
    console.debug('Create');
    this.scene.start('BattleScene');
  }
});

export const BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize:

  function BattleScene() {
    Phaser.Scene.call(this, { key: 'BattleScene' });
  },

  create: function(){
    console.debug('Create');
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
  
    // Heroes
    const fralle = new PlayerCharacter(this, 250, 50, 'hero1_frames', 0, 'Fralle', 'Water', 100, 20);
    this.add.existing(fralle);

    const felix = new PlayerCharacter(this, 250, 100, 'hero2_frames', 0, 'Felix', 'Fire', 100, 20); 
    this.add.existing(felix);
  
    // Enemies
    const spooks = new Enemy(this, 50, 50, 'enemy1_frames', 0, 'Tard', 'Normal', 100, 3); // HP satt till 10 för att de ska dö som fan, var 50 nyss
    this.add.existing(spooks);

    const tard = new Enemy(this, 50, 100, 'enemy2_frames', 0, 'Spooks', 'Earth', 100, 3); // Samma sak här 
    this.add.existing(tard);
  
    this.heroes = [fralle, felix];
  
    this.enemies = [spooks, tard];
  
    this.units = this.heroes.concat(this.enemies);
  
    // Run UI scene at the same time
    this.scene.launch('UIScene');
  
    this.index = -1;

    // needed?
    // this.EnemyAI = this.scene.get('EnemyAI');

  },

  nextTurn: function() {
    this.index++;
    // no more units? start from first
    if (this.index >= this.units.length) {
      this.index = 0;
    }
    while (this.units[this.index].hp <= 0){
      ++this.index;
    }
    if (this.units[this.index]) {
      // if its player hero
      if (this.units[this.index] instanceof PlayerCharacter) {
        this.events.emit('PlayerSelect', this.index);
      } else { // enemy unit
        // let r = Math.floor(Math.random() * this.heroes.length);
        // this.units[this.index].attack(this.heroes[r]);
        this.Tree();
        this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });

        // Insert behaviour tree here?
         

      }
    }
  },

  receivePlayerSelection: function(action, target) {
    if (action == 'attack') {
      console.log('Normal', this.index)
      this.units[this.index].attack(this.enemies[target]);
    }
    if (action == 'elementalAttack') {
      console.log('Elemental', this.index)
      this.unit[this.index].elementalAttack(this.enemies[target]);
    }
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this });
  },

  Tree: function() {
  console.log('Inside Tree')
  
    const builder = new BehaviorTreeBuilder();
    this.tree = builder  
      .sequence("testSeq")
        .do("testAction", async (t) =>{
            console.log('testAction1111')
            let r = Math.floor(Math.random() * this.heroes.length);
            this.units[this.index].attack(this.heroes[r]);

            return BehaviorTreeStatus.Success;
        })
        .do("TestAction2", async (t) => {
            console.log('testAction2222');
            
            return BehaviorTreeStatus.Failure;
        })
    .end()
    .build();

    this.tree.tick(3000);

    
  },

  
});

const Unit = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize:

  function Unit(scene, x, y, texture, frame, type, element, hp, damage) {
    Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame);
    this.type = type;
    this.element = element;
    this.maxHp = this.hp = hp;
    this.damage = damage;
  },

  attack: function(target) {
    target.takeDamage(this.damage);
    this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + " damage");
  },
  elementalAttack: function(target) {
    target.takeDamage(this.damage);
    //this.scene.events.emit("Message", this.type + " attacks " + target.type + " for " + this.damage + this.element + " damage");
  },

  takeDamage: function(damage) {
    this.hp -= damage;
    if(this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      console.log(this.type + " has died ")
      this.scene.events.emit("Message", this.type + " has died "); // Does not emit attack message
      this.setFrame(1);
    }
    console.log(this.type + " has " + this.hp + " hp left ");
  }

});

const Enemy = new Phaser.Class({
  Extends: Unit,

  initialize:
  function Enemy(scene, x, y, texture, frame, type, element, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, element, hp, damage);
    this.setScale(0.5);
  }
});

const PlayerCharacter = new Phaser.Class({
  Extends: Unit,

  initialize:
  function Enemy(scene, x, y, texture, frame, type, element, hp, damage) {
    Unit.call(this, scene, x, y, texture, frame, type, element, hp, damage);
    // this.flipX = true;
    this.setScale(0.5);
  }
});

const MenuItem = new Phaser.Class({
  Extends: Phaser.GameObjects.Text,

  initialize:

  function MenuItem(x, y, text, scene) {
    Phaser.GameObjects.Text.call(this, scene, x, y, text, { color: '#ffffff', align: 'left', fontSize: 15 });
    //console.log(this.hp); // this.hp är undefined
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
    this.menuItems[this.menuItemIndex].select();
  },

  moveSelectionDown: function() {
    this.menuItems[this.menuItemIndex].deselect();
    this.menuItemIndex++;

    if (this.menuItemIndex >= this.menuItems.length) {
      this.menuItemIndex = 0;
    }
    this.menuItems[this.menuItemIndex].select();
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

  undo: function() {
    // When player wants to undo selection
    this.currentMenu = this.ActionsMenu; //FUNGERAR INTE 
  },

  clear: function() {
    for(let i = 0; i < this.menuItems.length; i++) {
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
      // this.addMenuItem(unit.hp);
    }
  }
});

const HeroesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function HeroesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  }
});

const ActionsMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function ActionsMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
    this.addMenuItem('Attack');
    this.addMenuItem('Attack 2');
  },
  confirm: function() {
    this.scene.events.emit('SelectEnemies');
  }
});

const EnemiesMenu = new Phaser.Class({
  Extends: Menu,

  initialize:

  function EnemiesMenu(x, y, scene) {
    Menu.call(this, x, y, scene);
  },
  confirm: function() {
    this.scene.events.emit("Enemy", this.menuItemIndex);
  }
});


export const UIScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize:

  function UIScene() {
    Phaser.Scene.call(this, { key: 'UIScene' });
  },

  create: function() {
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

    this.heroesMenu = new HeroesMenu(195, 153, this);
    this.actionsMenu = new ActionsMenu(100, 153, this);
    this.enemiesMenu = new EnemiesMenu(8, 153, this);

    // currently selected menu
    this.currentMenu = this.actionsMenu;

    // add menus to container
    this.menus.add(this.heroesMenu);
    this.menus.add(this.actionsMenu);
    this.menus.add(this.enemiesMenu);

    this.battleScene = this.scene.get('BattleScene');

    this.remapHeroes();
    this.remapEnemies();

    this.input.keyboard.on('keydown', this.onKeyInput, this);

    this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

    this.events.on("SelectEnemies", this.onSelectEnemies, this);

    this.events.on("Enemy", this.onEnemy, this);

    this.message = new Message(this, this.battleScene.events);
    this.add.existing(this.message);

    this.battleScene.nextTurn();
  },

  onEnemy: function(index) {
    this.heroesMenu.deselect();
    this.actionsMenu.deselect();
    this.enemiesMenu.deselect();
    this.currentMenu = null;
    this.battleScene.receivePlayerSelection('attack', index);
  },

  onPlayerSelect: function(id) {
    this.heroesMenu.select(id);
    this.actionsMenu.select(0);
    this.currentMenu = this.actionsMenu;
  },

  onSelectEnemies: function() {
    this.currentMenu = this.enemiesMenu;
    this.enemiesMenu.select(0);
  },

  remapHeroes: function() {
    let heroes = this.battleScene.heroes;
    this.heroesMenu.reMap(heroes);
  },

  remapEnemies: function() {
    let enemies = this.battleScene.enemies;
    this.enemiesMenu.reMap(enemies);
  },

  onKeyInput: function(event) {
    if(this.currentMenu) {
      if(event.code === "ArrowUp") {
          this.currentMenu.moveSelectionUp();
      } else if(event.code === "ArrowDown") {
          this.currentMenu.moveSelectionDown();
      } else if(event.code === "ArrowRight" || event.code === "Shift") {
          //this.scene.start(ActionsMenu);
          //this.currentMenu.undo(); 
          //Ingen av dem funkar :(     )  
          console.log('ArrowRight logged')
      } else if(event.code === "Space" || event.code === "ArrowLeft") {
          this.currentMenu.confirm();
      } 
    }
  },
});

export const Message = new Phaser.Class({

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
    console.log('inside show')
    this.text.setText(text);
    this.visible = true;
    if(this.hideEvent)
        this.hideEvent.remove(false);
    this.hideEvent = this.scene.time.addEvent({ delay: 2000, callback: this.hideMessage, callbackScope: this });
},
  hideMessage: function() {
    console.log('inside hide')
    this.hideEvent = null;
    this.visible = false;
}
});