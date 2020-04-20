import * as Phaser from 'phaser';
import {DEBUG, PROD} from "../app/game_config";
import {randXY} from "../util/math";
import {Dir, DirOpposite, DirXY, Feat, isPipeOpen, isWater} from "./consts";
import {PipeGameObject} from "./objs/pipe_obj";
import {waterSpout} from "./objs/spout_obj";
import {TreeGameObject} from "./objs/tree_obj";
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

    pipesMap: PipeGameObject[][];
    pipesGroup: Group;
    treesGroup: Group;

    trees: TreeGameObject[];
    // spoutsGroup: Group;

    private container: Container;

    constructor(scene: Scene, width = 20, height = 8) {
        this.scene = scene;
        this.width = width;
        this.height = height;

        this.flowMap = makeMap(width, height, 0);
        this.featMap = makeMap(width, height, 0);
        this.pipesMap = makeMap(width, height, null);
        this.trees = [];

        this.init();
    }

    init() {
        const {width, height, scene} = this;

        const container = this.container = scene.add.container(this.offsetX, this.offsetY);
        this.pipesGroup = scene.add.group();
        this.treesGroup = scene.add.group();

        // trees
        for (let i = 0; i < 6; i++) {
            // let x = randAB(0, width);

            let tx = 2 + i * 3;

            // let frame = randPick(['tree_1', 'tree_2', 'tree_3', 'tree_4']);

            let t = new TreeGameObject(scene, tx, i%4);
            this.trees[tx] = t;
            this.treesGroup.add(t);
            container.add(t)

            // this.addPipe(x, 0, Feat.PipeNS, false);
            // this.addPipe(x, 1, Feat.PipeNS, false);
            // this.featMap[0][x] = Feat.PipeNS;
            // this.featMap[1][x] = Feat.PipeNS;
        }

        if (PROD) {
            // water spouts
            for (let i = 0; i < 5; i++) {
                let [x, y] = randXY(0, (height - 1) >> 1, width - 1, height - 1);
                this.featMap[y][x] = Feat.Water;
            }
        } else {
            this.featMap[3][5] = Feat.Water;
        }


        // this.spoutsGroup = scene.add.group();


        this.addPipe(5, 4, Feat.PipeNEW, false);
        this.addPipe(5, 0, Feat.PipeNS, false);
        this.addPipe(5, 1, Feat.PipeNS, false);
        this.addPipe(5, 2, Feat.PipeNS, false);
        this.addPipe(5, 3, Feat.PipeNS, false);


        this._rebuildNeighbors();

        // fluid update ticker
        this.scene.time.addEvent({
            loop: true,
            delay: 50,
            callback: this.fluidUpdate,
            callbackScope: this
        });

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

                if (!frame) continue;

                let s = scene.make.sprite({}, false)
                    .setPosition(px, py)
                    .setTexture('atlas', frame)
                    .setOrigin(0, 0);

                container.add(s);
            }
        }

    }

    update() {

    }

    inBounds = (tx, ty) => tx >= 0 && tx <= this.width - 1 && ty >= 0 && ty <= this.height - 1;

    fluidUpdate() {
        DEBUG && console.log("=======================");

        this.treesGroup.children.each((i: TreeGameObject) => {
            i.fixedUpdate();
        });

        this.pipesGroup.children.each((i: PipeGameObject) => {
            i.fluidUpdatePre();
        });

        this.pipesGroup.children.each((i: PipeGameObject) => {
            i.fluidUpdate();
        });

        this.pipesGroup.children.each((i: PipeGameObject) => {
            i.fluidUpdatePost();
        });
    }

    has(tx: int, ty: any): boolean {
        if (!this.inBounds(tx, ty)) return false;
        return this.pipesMap[ty][tx] != null;
    }

    set(tx: int, ty: any, featMask: int) {
        this.addPipe(tx, ty, featMask);
    }

    private addPipe(tx: int, ty: int, featMask: int, rebuild = true) {
        const p = new PipeGameObject(this.scene, this.container, tx * 16, ty * 16, featMask);

        this.container.add(p);
        // this.scene.children.add(p);
        this.pipesGroup.add(p);
        this.pipesGroup.runChildUpdate = true;

        if (this.pipesMap[ty][tx])
            this.pipesMap[ty][tx].destroy();

        this.pipesMap[ty][tx] = p;

        if (rebuild)
            this._rebuildNeighbors();
    }

    private _rebuildNeighbors() {
        // rebuild neighbours
        this.pipesGroup.children.each((ip: PipeGameObject) => {
            for (let dir = 0; dir < 4; dir++) {
                let [dx, dy] = DirXY[dir];
                let rx = ip.tileX + dx;
                let ry = ip.tileY + dy;

                if (ry == -1 && dir == 0) {
                    let t = this.trees[ip.tileX];
                    if (t) {
                        ip.neighbors[dir] = t;
                        t.pipe = ip;
                    }
                }

                if (!this.inBounds(rx, ry)) continue;

                if (!isPipeOpen(ip.pipeFlag, dir))
                    ip.neighbors[dir] = null;

                let np;
                let f = this.featMap[ry][rx];

                if (isWater(f))
                    np = waterSpout;
                else {
                    np = this.pipesMap[ry][rx];
                    if (np) {
                        if (!isPipeOpen(np.pipeFlag, DirOpposite[dir]))
                            np = null;
                    }
                }

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

