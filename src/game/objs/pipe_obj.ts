import * as Phaser from 'phaser';
import {DirOpposite, Feat, isPipe, isPipeOpen, PipeExits, PipeFrame} from "../consts";
import {IFluidObj} from "./fluid_obj";
import Container = Phaser.GameObjects.Container;

export class PipeGameObject
    extends Phaser.GameObjects.Container
    implements IFluidObj
{
    public neighbors: PipeGameObject[] = [null, null, null, null];

    public readonly pipeFlag: int;
    public readonly tileX: int;
    public readonly tileY: int;

    public nextPressure: [int, int, int, int] = [0, 0, 0, 0];
    public nextFlowMask: [int, int, int, int] = [0, 0, 0, 0];

    public pressure: [int, int, int, int] = [0, 0, 0, 0];
    public volume: [int, int, int, int] = [0, 0, 0, 0];
    public flowMask: [int, int, int, int] = [0, 0, 0, 0];

    // public fluidMasks: [int, int, int, int] = [0, 0, 0, 0];
    // private fluidDebits: [int, int, int, int] = [0, 0, 0, 0];
    // private fluidVelocities: [int, int, int, int] = [0, 0, 0, 0];


    private image: Phaser.GameObjects.Image;
    private maskImages: Phaser.GameObjects.Image[] = [];
    private maskBitmaps: Phaser.Display.Masks.BitmapMask[] = [];
    private tileFluids: Phaser.GameObjects.TileSprite[] = [];


    constructor(scene, parent: Container, x, y, pipeFlag) {
        super(scene, x, y);

        const offY = parent.y;

        this.tileX = x / 16;
        this.tileY = y / 16;
        this.pipeFlag = pipeFlag;


        this.image = this.scene.make.image({}, false)
            // .setPosition(8, 8)
            // .setOrigin(0.5, 0.5)
            .setOrigin(0, 0)
        this.add(this.image);



        for(let i=0; i<4; i++) {
            this.maskImages[i] = this.scene.make.image({}, false)
                .setOrigin(0.5, 0.5)
                .setRotation(i * Math.PI/2)
                .setPosition(x + 8, y + offY + 8);

            this.maskBitmaps[i] = this.maskImages[i].createBitmapMask();

            this.tileFluids[i] = this.scene.make.tileSprite({}, false)
                .setTexture('atlas', 'flow_1')
                .setAlpha(0.75)
                .setMask(this.maskBitmaps[i])
                .setOrigin(0.5, 0.5)
                .setPosition(8, 8)
                .setSize(128, 128)
                .setVisible(false)
            ;

            this.scene.tweens.add({
                targets: [this.tileFluids[i]],
                x: -20,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            this.add(this.tileFluids[i]);
        }

        this._updateTextures();
    }


    update(time) {
    }

    _updateTextures() {
        const featFlag = this.pipeFlag;

        if (isPipe(featFlag)) {
            let frame = PipeFrame[featFlag];

            this.image
                .setTexture('atlas', frame)
                // .setSize(16, 16)
                // .setOrigin(0.5, 0.5)
                // .setRotation(pt.deg * Rad90)
                // .setPosition(8, 8)
            ;
        }

    }

    fluidUpdatePre() {
    }

    fluidUpdate() {
        // const time = this.scene.time.now;


        // apply neighbouring pressure
        for(let dir=0; dir<4; dir++) {
            if (!isPipeOpen(this.pipeFlag, dir))
                continue;

            let opp = DirOpposite[dir];

            let nextPressure = 0;

            let neigh = this.neighbors[dir];
            if (neigh)
                nextPressure = neigh.pressure[opp];

            this.nextPressure[dir] = nextPressure;
        }

        // distribute internal pressure
        let total = this.nextPressure.reduce((r,i) => r + i, 0);
        let avg = Math.round(total / PipeExits[this.pipeFlag]);

        // internal mask: inward fluids masks (or'ed)
        let internalMask = 0;
        for(let dir=0; dir<4; dir++) {
            if (this.nextPressure[dir] > 0)
                internalMask |= this.flowMask[dir];
        }

        // balance pressure
        for(let dir=0; dir<4; dir++) {
            if (!isPipeOpen(this.pipeFlag, dir))
                continue;

            let opp = DirOpposite[dir];

            let p = this.nextPressure[dir] = this.nextPressure[dir] - avg;

            this.volume[dir] += p;

            if (p == 0) continue; // still

            const bits = Math.round(Math.log2(Math.abs(p))) >> 2;

            let m = this.flowMask[dir];

            if (p < 0) {
                // outward flow
                let slice = internalMask & (MASK2[bits - 1]);

                // todo: reverse slice bits
                // let mask = nextMask >> (16 - bits);
                // let mask = nextMask && (MASK2[bits - 1])

                m = (m << bits) | slice;
                // m = (m >> bits) | mask;
            } else {
                // inward flow
                let nextMask = 0;
                let neigh = this.neighbors[dir];
                if (neigh) {
                    nextMask = neigh.flowMask[opp];
                }

                let slice = (nextMask & (MASK2[bits - 1])) << (16 - bits);

                m = (m >> bits) | slice;
            }

            this.nextFlowMask[dir] = m;
        }


        // // flow
        // for(let i=0; i<4; i++) {
        //     const flow = this.inflow[i] > 0 ? 8 : 0;
        //     if (flow)
        //         this.fluidMasks[i] = this.fluidMasks[i] >> 1;
        // }
        //
        // // split flow
        // let midFlow = 0;
        // for(let i=0; i<4; i++)
        //     midFlow += this.fluidMasks[i] & 0b1;
        //
        //
        // const splits = [
        //     [],
        //     [[0],[1],[2],[3]],
        //     [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
        //     [[0,1,2], [0,1,3], [0,2,3], [1,2,3]],
        //     [[0,1,2,3]]
        // ]
        //
        // const rnd_split = randPick(splits[midFlow]);
        // if (rnd_split)
        //     for(let i of rnd_split) {
        //         this.fluidMasks[i] = ((this.fluidMasks[i] << 1) & 0b1111) | 1;
        //     }
        //
        //
        // // in flow
        // for(let i=0; i<4; i++) {
        //     const flow = this.inflow[i] > 0 ? 8 : 0;
        //     this.fluidMasks[i] = this.fluidMasks[i] | flow;
        // }


    }

    fluidUpdatePost() {

        console.log('Pipe: [%d, %d]', this.tileX, this.tileY);

        for(let i=0; i<4; i++) {
            this.pressure[i] = this.nextPressure[i];
            this.flowMask[i] = this.nextFlowMask[i];
            // this.debit[i] = this.nextDebit[i];
            // this.velocity[i] = this.nextVelocity[i];
        }

        const x1 = PIPE_MASKS[this.pipeFlag];
        for(let i=0; i<4; i++) {
            const open = isPipeOpen(this.pipeFlag, i);

            let flowMask = this.flowMask[i]; // 32 bit

            const seg0 = (flowMask >> 0) & 0xF;
            const seg1 = (flowMask >> 4) & 0xF;
            const seg2 = (flowMask >> 8) & 0xF;
            const seg3 = (flowMask >> 12) & 0xF;

            const maskIndex =
                (seg0 > 0 ? 0b0001 : 0)
                + (seg1 > 0 ? 0b0010 : 0)
                + (seg2 > 0 ? 0b0100 : 0)
                + (seg3 > 0 ? 0b1000 : 0);

            // const fluidMask = '2';

            // const maskFrame = 'a15';

            if (open) {
                const x2 = x1[i];
                const maskClass = x2.c;
                const flipX = x2.x == 1;
                const flipY = x2.y == 1;
                const maskFrame = maskClass + maskIndex;

                this.maskImages[i]
                    .setTexture('masks', maskFrame)
                    .setFlipX(flipX)
                    .setFlipY(flipY)
                ;
            }

            this.tileFluids[i].setVisible(open);
        }
    }
}

const PIPE_MASKS = {
    [Feat.PipeNW]: [{c: 'b', x: 1, y: 0}, null, null, {c: 'b', x: 0, y: 0}],
    [Feat.PipeEW]: [null, {c: 'a', x: 0, y: 0}, null, {c: 'a', x: 0, y: 0}],
};

const MASK2 = new Array(16).fill(0).map((_, i) => (1 << (i + 1)) - 1);



// export class PipePlugin extends Phaser.Plugins.BasePlugin {
//     constructor (pluginManager)
//     {
//         super(pluginManager);
//         pluginManager.registerGameObject('pipe', this.createPipe);
//     }
//
//     createPipe (this: any, x, y)
//     {
//         return this.displayList.add(new PipeGameObject(this.scene, x, y));
//     }
// }



