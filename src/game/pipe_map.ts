import * as Phaser from 'phaser';
import {Pipe} from "stream";
import {randXY} from "../util/math";
import {Dir, DirXY, Feat, isPipe, isWater, PipeTile} from "./consts";
import {PipeGameObject} from "./sprites/pipe_go";
import Container = Phaser.GameObjects.Container;
import Group = Phaser.GameObjects.Group;
import Scene = Phaser.Scene;


export class PipeMap {
    private scene: Scene;
    width: int;
    height: int;

    offsetX: int = 0;
    offsetY: int = 90;

    featMap: number[][];
    tileIndex: number[][];
    flowMap: number[][];

    pipesGroup: Group;
    pipesMap: PipeGameObject[][];

    private container: Container;

    constructor(scene: Scene, width = 20, height = 8) {
        this.scene = scene;
        this.width = width;
        this.height = height;

        this.flowMap = makeMap(width, height, 0);
        this.featMap = makeMap(width, height, 0);
        this.pipesMap = makeMap(width, height, null);
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

        const container = this.container = scene.add.container(this.offsetX, this.offsetY);

        this.pipesGroup = scene.add.group();

        // this.addPipe(0, 0);
        // this.addPipe(1, 0);
        // this.addPipe(0, 1);
        this.addPipe(2, 3);

        this.scene.time.addEvent({
            loop: true,
            delay: 200,
            callback: this.fluidUpdate,
            callbackScope: this
        });

        // container.add(new Pipe(scene, 'sprite'));

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

            this.addPipe(x, 0);
            this.addPipe(x, 1);
            // this.featMap[0][x] = Feat.PipeNS;
            // this.featMap[1][x] = Feat.PipeNS;
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

                // if (isPipe(feat)) {
                //     // frame = 'pipe_NESW';
                //     let pt = PipeTile[feat];
                //     frame = pt.frame;
                // }

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


    update() {
    }

    inBounds = (tx, ty) => tx >= 0 && tx <= this.width - 1 && ty >= 0 && ty <= this.height - 1;

    fluidUpdate() {
        // update inflows
        this.pipesGroup.children.each((p: PipeGameObject) => {
            let tx = p.tileX;
            let ty = p.tileY;


            for (let dir = 0; dir < 4; dir++) {
                let [dx, dy] = DirXY[dir];
                let rx = tx + dx;
                let ry = ty + dy;
                if (!this.inBounds(rx, ry)) continue;

                let w = isWater(this.featMap[ry][rx]) ? 255 : 0;

                let pn = p.neighbors[dir];
                if (pn)
                    w |= (pn.fluidMasks[dir] & 1);

                p.inflow[dir] = w ? 255 : 0;

            }
        });

        // update inflows
        this.pipesGroup.children.each((i: PipeGameObject) => {
            i.fluidUpdate();
        });
    }

    set(tx: any, ty: any, tile: any /*FIXME*/) {
        this.addPipe(tx, ty);
    }

    private addPipe(tx: number, ty: number) {
        const p = new PipeGameObject(this.scene, this.container, tx * 16, ty * 16);
        this.container.add(p);
        // this.scene.children.add(p);
        this.pipesGroup.add(p);
        this.pipesGroup.runChildUpdate = true;

        if (this.pipesMap[ty][tx])
            this.pipesMap[ty][tx].destroy();

        this.pipesMap[ty][tx] = p;

        // rebuild neighbours
        this.pipesGroup.children.each((ip: PipeGameObject) => {
            for (let dir = 0; dir < 4; dir++) {
                let [dx, dy] = DirXY[dir];
                let rx = ip.tileX + dx;
                let ry = ip.tileY + dy;
                if (!this.inBounds(rx, ry)) continue;

                let np = this.pipesMap[ry][rx];
                ip.neighbors[dir] = np;
            }
        });
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

