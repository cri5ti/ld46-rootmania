import * as Phaser from 'phaser';
import {tweakJsonCoords} from "../util/json";
import {lerp, randPick} from "../util/math";
import {Feat, PipeFrame} from "./consts";
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
        this.load.audio('sfx_replace', require('../res/sfx/explosion_11.wav'));
        this.load.audio('music', require('../res/sfx/2192.ogg'));

        this.load.image('bg1', require('../res/bg1.png'));
        this.load.atlas('atlas', require('../res/atlas.png'), tweakJsonCoords(require('../res/atlas.json')));
        this.load.atlas('masks', require('../res/masks.png'), tweakJsonCoords(require('../res/masks.json')));
        this.load.atlas('animations', require('../res/animations.png'), tweakJsonCoords(require('../res/animations.json')));
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

        const allPipes = [ // todo: add ratios?
            Feat.PipeNS, Feat.PipeEW,
            Feat.PipeNE, Feat.PipeES, Feat.PipeSW, Feat.PipeNW,
            Feat.PipeNES, Feat.PipeESW, Feat.PipeNSW, Feat.PipeNEW,
            Feat.PipeNESW
        ];

        for (let i = 0; i < initialPieceCount; i++) {
            const feat = randPick(allPipes);

            let ty = 222;
            let tx = 4 + i * 20;

            const frame = PipeFrame[feat];

            const img = this.add.image(400, ty, 'atlas', frame)
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



        this.anims.create({
            key: 'drop_cursor_fx1',
            frames: this.anims.generateFrameNames('animations', { prefix: 'grid_square_', end: 7}),
            repeat: -1,
            frameRate: 20
        });

        const drop_cursor = this.add.sprite(100, 100, 'animations')
            .setDepth(1)
            .setSize(16, 16)
            .setOrigin(0, 0)
            .setVisible(false)
            .play('drop_cursor_fx1')
        ;

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

            let tx = toGrid(gameObject.x, 16, this.pipeMap.offsetX);
            let ty = toGrid(gameObject.y, 16, this.pipeMap.offsetY);
            let inBounds = tx >= 0 && ty >= 0 && tx < this.pipeMap.width && ty < this.pipeMap.height;

            drop_cursor.setVisible(inBounds);
            drop_cursor.setPosition(
            tx * 16 + this.pipeMap.offsetX,
            ty * 16 + this.pipeMap.offsetY
            );
        });


        function toGrid(i, grid, offs) {
            return Math.round((i - offs) / grid);
        }

        this.input.on('dragend', (pointer, gameObject: Sprite, dragX, dragY) => {
            let tx = toGrid(gameObject.x, 16, this.pipeMap.offsetX);
            let ty = toGrid(gameObject.y, 16, this.pipeMap.offsetY);

            let tile = Feat.PipeNESW; // fixme

            if (this.pipeMap.has(tx, ty))
                scene.sound.play('sfx_replace');
            else
                scene.sound.play('sfx_plop');


            this.pipeMap.set(tx, ty, tile);

            gameObject.destroy();
            dragEmitter.on = false;
            let emitter = dragEmitter;
            scene.time.delayedCall(3000, function () {
                emitter.remove();
            });

            drop_cursor.setVisible(false);
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
