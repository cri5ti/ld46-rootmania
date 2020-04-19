import * as Phaser from 'phaser';
import {createEmitterGlitter} from "./particles/particle_glit";
import {createEmitterSmoke} from "./particles/particle_smoke";
import Container = Phaser.GameObjects.Container;
import Sprite = Phaser.GameObjects.Sprite;
import Scene = Phaser.Scene;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;


const sceneGame = {
    key: 'game',

    preload: preload,
    create: create,
    update: update
};

let i: Phaser.GameObjects.Image;


const $corrected = Symbol();

function preload(this: Phaser.Scene) {
    this.load.image('bg1', require('../res/bg1.png'));
    this.load.image('tiles1', require('../res/piples1.png'))

    const json = require('../res/atlas.json');

    if (!json[$corrected]) {
        json[$corrected] = true;
        const slices = json.meta.slices.reduce((r, i) => {
            r[i.name] = i.keys[0];
            return r
        }, {});

        for (let k in json.frames) {
            let f = json.frames[k];

            let s = slices[k];

            if (s) {
                f.spriteSourceSize.x = -s.pivot.x + (f.spriteSourceSize.x % 16);
                f.spriteSourceSize.y = -s.pivot.y + (f.spriteSourceSize.y % 16);
                f.sourceSize.w = f.spriteSourceSize.w;
                f.sourceSize.h = f.spriteSourceSize.h;
            } else {
                f.spriteSourceSize.x = (f.spriteSourceSize.x % 16);
                f.spriteSourceSize.y = (f.spriteSourceSize.y % 16);
                f.sourceSize.w = f.spriteSourceSize.w;
                f.sourceSize.h = f.spriteSourceSize.h;
            }
        }
    }

    this.load.atlas('atlas', require('../res/atlas.png'), json);
}


function create() {

    this.add.image(0, 0, 'bg1').setOrigin(0, 0);


    const truck1 = this.add.sprite(300, 80,'atlas', 'truck_1');
    this.tweens.add({
        targets: [ truck1 ],
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

    const map = new Map(this);

    for (let i = 0; i < 16; i++) {
        const f = ["pipe_NESW", "pipe_NE", "pipe_NES", "pipe_NS"][Math.random() * 3 | 0]
        const img = this.add.image(4 + i * 20, 222, 'atlas', f)
            .setDepth(2)
            .setSize(16, 16)
            .setOrigin(0,0);

        img.setInteractive();
        this.input.setDraggable(img);
    }



    let dragEmitter: ParticleEmitter;
    let scene = this;
    this.input.on('dragstart', function (pointer, gameObject, dragX, dragY) {
        dragEmitter = createEmitterGlitter(scene);
        dragEmitter.startFollow(gameObject, 8, 8);
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject: Sprite, dragX, dragY) {
        gameObject.x = Math.round(gameObject.x / 16) * 16;
        gameObject.y = Math.round(gameObject.y / 16) * 16;
        dragEmitter.on = false;
        let emitter = dragEmitter;
        scene.time.delayedCall(3000, function() {
            emitter.remove();
        });
    });


}

let f = 0;

// let z = 1;
function update() {

    // z += 0.005;
    // this.cameras.main.setZoom(z);

    // f++;
    // i.setFrame(f%4);
    // i.frame.
}


type int = number;


const enum Feat {
    Water = 0b0_1_0000,
    PipeNE = 0b0_0011,
    PipeNS = 0b0_0101,
    PipeES = 0b0_0110,
    PipeNES = 0b0_0111,
    PipeNW = 0b0_1001,
    PipeEW = 0b0_1010,
    PipeNEW = 0b0_1011,
    PipeSW = 0b0_1100,
    PipeNSW = 0b0_1101,
    PipeESW = 0b0_1110,
    PipeNESW = 0b0_1111,
}

function isWater(n: int) {
    return (n & 0b1_0000) > 0;
}

function isPipe(n: int) {
    return (n & 0b1111) > 0;
}

function isPipeN(n: int) {
    return (n & 0b0001) > 0;
}

function isPipeE(n: int) {
    return (n & 0b0010) > 0;
}

function isPipeS(n: int) {
    return (n & 0b0100) > 0;
}

function isPipeW(n: int) {
    return (n & 0b1000) > 0;
}

const PipeTile = {
    // horizontal, vertical
    [Feat.PipeNS]: {frame: 'pipe_NS', deg: 0},
    [Feat.PipeEW]: {frame: 'pipe_NS', deg: 1},

    // corner
    [Feat.PipeNE]: {frame: 'pipe_NE', deg: 0},
    [Feat.PipeES]: {frame: 'pipe_NE', deg: 1},
    [Feat.PipeSW]: {frame: 'pipe_NE', deg: 2},
    [Feat.PipeNW]: {frame: 'pipe_NE', deg: 3},

    // 3
    [Feat.PipeNES]: {frame: 'pipe_NES', deg: 0},
    [Feat.PipeESW]: {frame: 'pipe_NES', deg: 1},
    [Feat.PipeNSW]: {frame: 'pipe_NES', deg: 2},
    [Feat.PipeNEW]: {frame: 'pipe_NES', deg: 3},

    // 4
    [Feat.PipeNESW]: {frame: 'pipe_NESW', deg: 0},
};


class Map {
    private scene: Scene;
    width: int;
    height: int;

    featMap: number[][];
    tileIndex: number[][];
    flowMap: number[][];

    private container: Container;

    constructor(scene: Scene, width = 20, height = 8) {
        this.scene = scene;
        this.width = width;
        this.height = height;

        this.flowMap = makeMap(width, height, 0);
        this.featMap = makeMap(width, height, 0);
        this.init();
    }

    init() {
        const {width, height, scene} = this;

        // const map = scene.make.tilemap({
        //     key: 'map',
        //     tileWidth: 16,
        //     tileHeight: 16,
        //     data: makeMap(width, height, 0)
        // });
        //
        // map.addTilesetImage('set1', 'tiles1', 16, 16);
        //
        // this._tileLayer = map.createDynamicLayer('layer', 'set1', 0, 80);
        // this._tileLayer.layer.width = width;
        // this._tileLayer.layer.height = height;

        const container = this.container = scene.add.container(0, 80);

        // trees
        for (let i = 0; i < 6; i++) {
            // let x = randAB(0, width);

            let x = 2 + i * 3;

            let px = x * 16;
            let py = -16;

            // let frame = randPick(['tree_1', 'tree_2', 'tree_3', 'tree_4']);
            let frame = ['tree_1', 'tree_2', 'tree_3', 'tree_4', 'tree_3', 'tree_2'][i];

            let s = scene.make.sprite({}, false)
                .setPosition(px, py)
                .setTexture('atlas', frame)
                .setOrigin(0, 0);
            container.add(s);

            this.featMap[0][x] = Feat.PipeNS;
            this.featMap[1][x] = Feat.PipeNS;
        }

        // water spouts
        for (let i = 0; i < 5; i++) {
            let [x, y] = randXY(0, (height - 1)>>1, width - 1, height - 1);
            this.featMap[y][x] = Feat.Water;
        }


        this.rebuildTiles();
    }

    rebuildTiles() {
        const {width, height, scene, container, featMap} = this;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let px = x * 16;
                let py = y * 16;

                let feat = featMap[y][x];

                let frame;

                if (isWater(feat))
                    frame = 'water';

                if (isPipe(feat)) {
                    // frame = 'pipe_NESW';
                    let pt = PipeTile[feat];
                    frame = pt.frame;
                }

                if (!frame) continue;

                let s = scene.make.sprite({}, false)
                    .setPosition(px, py)
                    .setTexture('atlas', frame)
                    .setOrigin(0, 0);

                container.add(s);

                // let t = layer.getTileAt(x, y, true);
                //
                // let f = featMap[x][y];
                //
                //
                // t.updatePixelXY()
                // t.index;
                // //
                // //
                // // const ix = Math.random()*5 | 0;
                // // t.index = ix;
                // // t.flipX = Math.random()*2 > 1 ? true : false;
                // // t.flipY = Math.random()*2 > 1 ? true : false;
                //
                // layer.putTileAt(t, x, y);
            }
        }

    }

}


function makeMap<T>(w, h, init: T | ((x, y) => T)): T[][] {
    let mapper: Function =
        typeof init !== 'function'
            ? () => init as any
            : init;

    return new Array(h)
        .fill(null)
        .map(y => new Array(w)
            .fill(null)
            .map(x => mapper(x, y))
        )
}


function randXY(x1: int, y1: int, x2: int, y2: int): [int, int] {
    return [randAB(x1, x2), randAB(y1, y2)];
}

function randAB(a: int, b: int): int {
    return rand0N(b - a) + a;
}

function rand0N(n: int): int {
    return (Math.random() * n) | 0;
}

function randPick<T>(arr:T[]):T {
    return arr[rand0N(arr.length)];
}


export default sceneGame;
