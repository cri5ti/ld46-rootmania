import * as Phaser from 'phaser';
import {PROD} from "../app/game_config";
import {tweakJsonCoords} from "../util/json";
import {randAB, randPick} from "../util/math";
import {Gui} from "./gui";
import {ChopperGameObject} from "./objs/chopper";
import {TreeGameObject} from "./objs/tree_obj";
import {PipeMap} from "./pipe_map";
import Group = Phaser.GameObjects.Group;

const atlas_json = require('../../assets/atlas.json');
const masks_json = require('../../assets/masks.json');
const animations_json = require('../../assets/animations.json');

export class SceneGame extends Phaser.Scene {
    pipeMap: PipeMap;
    gui: Gui;

    choppers: Group;

    preload() {
        this.load.audio('sfx_plop', 'assets/sfx/blip_select_1.wav');
        this.load.audio('sfx_pick', 'assets/sfx/jump_15.wav');
        this.load.audio('sfx_get', 'assets/sfx/blip_select_12.wav');
        this.load.audio('sfx_replace', 'assets/sfx/explosion_11.wav');
        this.load.audio('sfx_grow', 'assets/sfx/jump_38.wav');
        this.load.audio('sfx_chop', 'assets/sfx/random_122.wav');
        this.load.audio('music', 'assets/sfx/2192.ogg');

        this.load.image('bg1', 'assets/bg1.png');
        this.load.atlas('atlas', 'assets/atlas.png', tweakJsonCoords(atlas_json ));
        this.load.atlas('masks', 'assets/masks.png', tweakJsonCoords(masks_json));
        this.load.atlas('animations', 'assets/animations.png', tweakJsonCoords(animations_json));
    }


    create() {
        this.add.image(0, 0, 'bg1').setOrigin(0, 0);

        this.anims.create({
            key: 'middle',
            frames: this.anims.generateFrameNames('animations', { prefix: 'middle_', end: 7}),
            repeat: -1,
            frameRate: 20
        });

        if (PROD) {
            const music = this.sound.add('music', {loop: true, volume: 0.75});
            setTimeout(() => music.play(), 2000);
        }

        this.pipeMap = new PipeMap(this);

        this.gui = new Gui(this);

        this.choppers = this.add.group();
        this.choppers.runChildUpdate = true;

        this.time.addEvent({
            callback: this._onChop,
            delay: PROD ? randAB(2, 5) * 1000 : 2 * 1000,
            loop: true,
        });
    }

    _onChop = () => {

        // 1 extra chopper per minute
        const maxChoppers = Math.round(this.time.now / 30000);
        console.log('maxChoppers: ', maxChoppers);

        if (this.choppers.children.size > maxChoppers) return;

        const x = this.pipeMap.treesGroup.children.getArray();
        const y = x.filter((i:TreeGameObject) => i.treeSize > 0)
        const target = randPick(y);
        if (!target) return;

        const c = new ChopperGameObject(this, randPick([-10, 340]), target);
        this.choppers.add(c);
        this.children.add(c);
    };

    update(time, delta) {
        this.gui.update(time, delta);

        this.pipeMap.update();
        this.choppers.children.each(i => i.update(time, delta));

        if (this.pipeMap.treesGroup.getLength() == 0) {
            this.scene.get('game').cameras.main.fadeOut(2000);
            setTimeout(() => {
                const s2 = this.scene.start('end');
                s2.get('menu').cameras.main.fadeIn(1000);
            }, 2000);
        }
    }
}



const sceneGame = new SceneGame({key: 'game'});
export default sceneGame;
