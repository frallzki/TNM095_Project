import { BlendModes, Scene } from 'phaser';
//import BehaviourTree, { Sequence, Task, SUCCESS, FAILURE } from 'behaviortree';
import {BehaviorTreeBuilder, BehaviorTreeStatus, TimeData} from "fluent-behavior-tree";

export const EnemyAI = new Phaser.Class({
    Extends: Phaser.Scene,

    initalize:
    function EnemyAI() {
        Phaser.Scene.call(this, { key: 'EnemyAI' });
    },

    Tree: function() {
        this.tree = new BehaviorTreeBuilder();
        
        this.Sequence("testSeq")
            .do("testAction", async (t) => {
                console.log('testAction1111')

                return BehaviorTreeStatus.Success;
            })
            .do("TestAction2", async (t) => {
                console.log('testAction2222');
                
                return BehaviorTreeStatus.Failure;
            })
        .end()
        .build();
    },

    create: function() {
        console.debug('Create');
    }
});