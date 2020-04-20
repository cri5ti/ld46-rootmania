import * as Phaser from 'phaser';
import {randXY} from "../util/math";
import {DirXY, Feat, isWater} from "./consts";
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

        const container = this.container = scene.add.container(this.offsetX, this.offsetY);

        this.pipesGroup = scene.add.group();

        // this.addPipe(0, 0);
        // this.addPipe(1, 0);
        // this.addPipe(0, 1);
        this.addPipe(2, 3, Feat.PipeNESW);
        this.addPipe(3, 3, Feat.PipeEW);
        this.addPipe(4, 3, Feat.PipeSW);
        this.addPipe(4, 4, Feat.PipeNE);
        this.addPipe(5, 4, Feat.PipeNW);

        this.scene.time.addEvent({
            loop: true,
            delay: 20,
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

            this.addPipe(x, 0, Feat.PipeNS);
            this.addPipe(x, 1, Feat.PipeNS);
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

    has(tx: int, ty: any): boolean {
        if (!this.inBounds(tx, ty)) return false;
        return this.pipesMap[ty][tx] != null;
    }

    set(tx: int, ty: any, featMask: int) {
        this.addPipe(tx, ty, featMask);
    }

    private addPipe(tx: int, ty: int, featMask: int) {

        const p = new PipeGameObject(this.scene, this.container, tx * 16, ty * 16, featMask);

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

