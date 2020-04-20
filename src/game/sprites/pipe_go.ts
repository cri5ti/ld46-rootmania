import * as Phaser from 'phaser';
import {Pipe} from "stream";
import {randPick} from "../../util/math";
import Container = Phaser.GameObjects.Container;

export class PipeGameObject extends Phaser.GameObjects.Container
{
    private image: Phaser.GameObjects.Image;

    private maskImages: Phaser.GameObjects.Image[] = [];
    private maskBitmaps: Phaser.Display.Masks.BitmapMask[] = [];
    private tileFluids: Phaser.GameObjects.TileSprite[] = [];

    public tileX: int;
    public tileY: int;

    public inflow: [int, int, int, int] = [0, 0, 0, 0];
    private pipeFlag: int;
    public fluidMasks: [int, int, int, int] = [0, 0, 0, 0];
    private fluidDebits: [int, int, int, int] = [0, 0, 0, 0];
    private fluidVelocities: [int, int, int, int] = [0, 0, 0, 0];

    public neighbors: PipeGameObject[] = [null, null, null, null];

    constructor(scene, parent: Container, x, y) {
        super(scene, x, y);

        const offy = parent.y;

        this.tileX = x / 16;
        this.tileY = y / 16;
        // this.scale = 2;

        this.image = this.scene.make.image({}, false)
            .setPosition(0, 0)
            .setOrigin(0, 0)
        this.add(this.image);



        for(let i=0; i<4; i++) {
            this.maskImages[i] = this.scene.make.image({}, false)
                .setOrigin(0.5, 0.5)
                .setRotation(i * Math.PI/2)
                .setPosition(x + 8, y + offy + 8);

            this.maskBitmaps[i] = this.maskImages[i].createBitmapMask();

            this.tileFluids[i] = this.scene.make.tileSprite({}, false)
                .setTexture('atlas', 'flow_1')
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
    }


    t = 0;

    update(time) {
        this.image.setTexture('atlas', 'pipe_NESW');
    }

    fluidUpdate() {
        this.t++;

        const time = this.scene.time.now;

        this.image.setTexture('atlas', 'pipe_NESW');

        // flow
        for(let i=0; i<4; i++) {
            const flow = this.inflow[i] > 0 ? 8 : 0;
            if (flow)
                this.fluidMasks[i] = this.fluidMasks[i] >> 1;
        }

        // split flow
        let midFlow = 0;
        for(let i=0; i<4; i++)
            midFlow += this.fluidMasks[i] & 0b1;


        const splits = [
            [],
            [[0],[1],[2],[3]],
            [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]],
            [[0,1,2], [0,1,3], [0,2,3], [1,2,3]],
            [[0,1,2,3]]
        ]

        const rnd_split = randPick(splits[midFlow]);
        if (rnd_split)
            for(let i of rnd_split) {
                this.fluidMasks[i] = ((this.fluidMasks[i] << 1) & 0b1111) | 1;
            }


        // in flow
        for(let i=0; i<4; i++) {
            const flow = this.inflow[i] > 0 ? 8 : 0;
            this.fluidMasks[i] = this.fluidMasks[i] | flow;
        }



        for(let i=0; i<4; i++) {

            let fluidMask = this.fluidMasks[i];

            // const fluidMask = '2';
            const maskClass = 'a';
            const maskFrame = maskClass + fluidMask;
            // const maskFrame = 'a15';

            this.maskImages[i].setTexture('masks', maskFrame);
            this.tileFluids[i].setVisible(true);
        }
    }
}




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



