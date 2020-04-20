import * as Phaser from 'phaser';
import {PROD} from "../app/game_config";
import {tweakJsonCoords} from "../util/json";
import {Gui} from "./gui";
import {createEmitterSmoke} from "./particles/particle_smoke";
import {PipeMap} from "./pipe_map";

const atlas_json = require('../../assets/atlas.json');
const masks_json = require('../../assets/masks.json');
const animations_json = require('../../assets/animations.json');

export class SceneGame extends Phaser.Scene {
    pipeMap: PipeMap;
    gui: Gui;

    preload() {
        this.load.audio('sfx_plop', 'assets/sfx/blip_select_1.wav');
        this.load.audio('sfx_pick', 'assets/sfx/jump_15.wav');
        this.load.audio('sfx_get', 'assets/sfx/blip_select_12.wav');
        this.load.audio('sfx_replace', 'assets/sfx/explosion_11.wav');
        this.load.audio('music', 'assets/sfx/2192.ogg');

        this.load.image('bg1', 'assets/bg1.png');
        this.load.atlas('atlas', 'assets/atlas.png', tweakJsonCoords(atlas_json ));
        this.load.atlas('masks', 'assets/masks.png', tweakJsonCoords(masks_json));
        this.load.atlas('animations', 'assets/animations.png', tweakJsonCoords(animations_json));
    }


    create() {
        this.add.image(0, 0, 'bg1').setOrigin(0, 0);

        if (PROD) {
            const music = this.sound.add('music', {loop: true, volume: 0.75});
            setTimeout(() => music.play(), 2000);
        }


        const truck1 = this.add.sprite(300, 80, 'atlas', 'truck_1');
        this.tweens.add({
            targets: [truck1],
            x: 0,
            duration: 24000,
            yoyo: true,
            flipX: true,
            repeat: -1
        });
        const smoke = createEmitterSmoke(this);
        smoke.startFollow(truck1, 16);

        this.pipeMap = new PipeMap(this);

        this.gui = new Gui(this);
    }

    update(time, delta) {
        this.gui.update(time, delta);

        this.pipeMap.update();
    }
}



const sceneGame = new SceneGame({key: 'game'});
export default sceneGame;
