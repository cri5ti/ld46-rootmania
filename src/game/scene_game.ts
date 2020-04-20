import * as Phaser from 'phaser';
import {tweakJsonCoords} from "../util/json";
import {lerp} from "../util/math";
import {createEmitterGlitter} from "./particles/particle_glit";
import {createEmitterSmoke} from "./particles/particle_smoke";
import {PipeMap} from "./pipe_map";
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Sprite = Phaser.GameObjects.Sprite;

const PROD = process.env.NODE_ENV !== 'development';
// const PROD = true;



class SceneGame extends Phaser.Scene {
    private pipeMap: PipeMap;

    preload() {
        this.load.audio('sfx_plop', require('../res/sfx/blip_select_1.wav'));
        this.load.audio('sfx_pick', require('../res/sfx/jump_15.wav'));
        this.load.audio('sfx_get', require('../res/sfx/blip_select_12.wav'));
        this.load.audio('music', require('../res/sfx/2192.ogg'));

        this.load.image('bg1', require('../res/bg1.png'));
        this.load.atlas('atlas', require('../res/atlas.png'), tweakJsonCoords(require('../res/atlas.json')));
        this.load.atlas('masks', require('../res/masks.png'), tweakJsonCoords(require('../res/masks.json')));
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
            //  ease: 'Sine.easeInOut',
            yoyo: true,
            flipX: true,
            repeat: -1
        });
        const smoke = createEmitterSmoke(this);
        smoke.startFollow(truck1, 16);

        // const width = 20;
        // const height = 8;

        // const map = this.make.tilemap({
        //     key: 'map',
        //     tileWidth: 16,
        //     tileHeight: 16,
        //     data: new Array(height).fill(0).map(() => new Array(width).fill(0))
        // });
        // const tileset = map.addTilesetImage('set1', 'tiles1', 16, 16);
        // const layer = map.createDynamicLayer('layer', 'set1', 0, 80);
        //
        // layer.layer.width = width;
        // layer.layer.height = height;
        //
        // for (let y = 0; y < layer.layer.height; y++) {
        //     for (let x = 0; x < layer.layer.width; x++) {
        //         let t = layer.getTileAt(x, y, true);
        //
        //         const ix = Math.random()*5 | 0;
        //         t.index = ix;
        //         t.flipX = Math.random()*2 > 1 ? true : false;
        //         t.flipY = Math.random()*2 > 1 ? true : false;
        //         layer.putTileAt(t, x, y);
        //     }
        // }


        this.pipeMap = new PipeMap(this);

        const initialPieceCount = 15;

        for (let i = 0; i < initialPieceCount; i++) {
            const f = ["pipe_NESW", "pipe_NE", "pipe_NES", "pipe_NS"][Math.random() * 3 | 0]

            let ty = 222;
            let tx = 4 + i * 20;

            const img = this.add.image(400, ty, 'atlas', f)
                .setDepth(2)
                .setSize(16, 16)
                .setOrigin(0, 0);

            let delay = i * lerp(i, 0, initialPieceCount, 160, 60);
            let duration = lerp(i, 0, initialPieceCount, 600, 300);

            if (!PROD) {
                delay /= 5;
                duration /= 5;
            }

            this.tweens.add({
                onStart: () => {
                    PROD && scene.sound.play('sfx_get', {delay: duration / 1000, volume: 0.2})
                },
                delay,
                targets: [img],
                x: {from: 400, to: tx},
                duration,
                ease: 'Sine.easeIn'
            });

            img.setInteractive();
            this.input.setDraggable(img);
        }

        // this.sound.add('blip_select_1');

        let dragEmitter: ParticleEmitter;
        let scene = this;
        this.input.on('dragstart', function (pointer, gameObject, dragX, dragY) {
            scene.sound.play('sfx_pick');
            dragEmitter = createEmitterGlitter(scene);
            dragEmitter.startFollow(gameObject, 8, 8);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            this.pipeMap
            gameObject.x = dragX;
            gameObject.y = dragY;
        });


        function toGrid(i, grid, offs) {
            return Math.round((i - offs) / grid);
        }

        this.input.on('dragend', (pointer, gameObject: Sprite, dragX, dragY) => {
            scene.sound.play('sfx_plop');

            let tx = toGrid(gameObject.x, 16, this.pipeMap.offsetX);
            let ty = toGrid(gameObject.y, 16, this.pipeMap.offsetY);

            let tile = '?'; // fixme

            this.pipeMap.set(tx, ty, tile);

            gameObject.destroy();
            dragEmitter.on = false;
            let emitter = dragEmitter;
            scene.time.delayedCall(3000, function () {
                emitter.remove();
            });
        });


    }

    update() {

        this.pipeMap.update();
        // z += 0.005;
        // this.cameras.main.setZoom(z);

        // f++;
        // i.setFrame(f%4);
        // i.frame.
    }
}



const sceneGame = new SceneGame({key: 'game'});
export default sceneGame;
