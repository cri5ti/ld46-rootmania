import * as Phaser from 'phaser';
import {PROD} from "../app/game_config";
import {lerp, randPick} from "../util/math";
import {Feat, PipeFrame} from "./consts";
import {createEmitterGlitter} from "./particles/particle_glit";
import {PipeMap} from "./pipe_map";
import {SceneGame} from "./scene_game";
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;
import Sprite = Phaser.GameObjects.Sprite;
import GameObject = Phaser.GameObjects.GameObject;


export class Gui extends Phaser.GameObjects.Container {

    scene: SceneGame;
    pipeMap: PipeMap;


    maxStackSize = 8;
    stack: GameObject[] = [];


    constructor(scene: SceneGame) {
        super(scene, 0, 0);

        this.pipeMap = scene.pipeMap;

        const initialPieceCount = 15;


        scene.anims.create({
            key: 'drop_cursor_fx1',
            frames: scene.anims.generateFrameNames('animations', { prefix: 'grid_square_', end: 7}),
            repeat: -1,
            frameRate: 20
        });

        const drop_cursor = scene.add.sprite(100, 100, 'animations')
            .setDepth(1)
            .setSize(16, 16)
            .setOrigin(0, 0)
            .setVisible(false)
            .play('drop_cursor_fx1')
        ;

        let dragEmitter: ParticleEmitter;

        scene.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            scene.sound.play('sfx_pick');
            dragEmitter = createEmitterGlitter(scene);
            dragEmitter.startFollow(gameObject, 8, 8);

            this._extractStack(gameObject);
        });

        scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            scene.pipeMap
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

        scene.input.on('dragend', (pointer, gameObject: Sprite, dragX, dragY) => {
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


    update(time, delta) {
        let seq = 0;
        while(this.stack.length < this.maxStackSize) {
            this._insertStack(seq++);
        }
    }

    _extractStack(go: GameObject) {
        const ix = this.stack.indexOf(go);
        if (ix == -1) return;

        this.stack.splice(ix, 1);

        for (let i = ix; i < this.stack.length; i++)
            this._slide(this.stack[i], i, i - ix);
    }


    _insertStack(seqIx: int = 0) {
        const ix = this.stack.length;
        const feat = randPick(ALL_PIPES);

        let ty = 222;

        const frame = PipeFrame[feat];

        const img = this.scene.add.image(400, ty, 'atlas', frame)
            .setDepth(2)
            .setSize(16, 16)
            .setOrigin(0, 0);

        this.stack.push(img);

        img.setInteractive();
        this.scene.input.setDraggable(img);

        this._slide(img, ix, seqIx);
    }

    _slide(go: GameObject, tx: int, seqIx: int) {
        let px = 4 + tx * 20;
        let delay = seqIx * lerp(seqIx, 0, 15, 160, 60);
        let duration = lerp(seqIx, 0, 15, 600, 300);

        if (!PROD) {
            // delay /= 5;
            // duration /= 5;
        }

        this.scene.tweens.add({
            onStart: () => {
                PROD && this.scene.sound.play('sfx_get', {delay: duration / 1000, volume: 0.2})
            },
            delay,
            targets: [go],
            x: px,
            duration,
            ease: 'Sine.easeIn'
        });

    }
}


const ALL_PIPES = [ // todo: add ratios?
    Feat.PipeNS, Feat.PipeEW,
    Feat.PipeNE, Feat.PipeES, Feat.PipeSW, Feat.PipeNW,
    Feat.PipeNES, Feat.PipeESW, Feat.PipeNSW, Feat.PipeNEW,
    Feat.PipeNESW
];