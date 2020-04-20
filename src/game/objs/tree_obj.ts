import * as Phaser from 'phaser';
import {IFluidObj} from "./fluid_obj";
import {PipeGameObject} from "./pipe_obj";

export class TreeGameObject
    extends Phaser.GameObjects.Container
    implements IFluidObj
{
    pipe: PipeGameObject;

    flowMask = [0, 0, 0, 0];
    id = "tree";
    pressure = [0, 0, 0, 0];
    volume = [0, 0, 0, 0];

    private tileFluidTop: Phaser.GameObjects.TileSprite;
    private tileFluidMid: Phaser.GameObjects.TileSprite;
    private size: int;
    private treeSprite: Phaser.GameObjects.Sprite;
    private treeMask: Phaser.GameObjects.Image;
    private maskBitmap: Phaser.Display.Masks.BitmapMask;

    constructor(scene, tx, size: int) {
        super(scene, tx*16, 0);

        this.size = size;
        // let px = tx * 16;
        // let py = -16;


        this.treeSprite = scene.make.sprite({}, false)
            .setPosition(0, -16)
            .setOrigin(0, 0);


        this.treeMask = this.scene.make.image({}, false)
            .setOrigin(0, 0)
            .setPosition(tx*16 - 16, 26);

        this.tileFluidTop = this.scene.make.tileSprite({}, false)
            .setAlpha(0.75)
            .setOrigin(0, 0)
            .setSize(64, 16)
            // .setMask(this.maskBitmap)
        ;
        this.tileFluidMid = this.scene.make.tileSprite({}, false)
            .setAlpha(0.75)
            .setPosition(tx*16, 0)
            .setOrigin(0, 0)
            // .setPosition(-100, -100)
            .setSize(256, 256)
            // .setMask(this.maskBitmap)
        ;

        this.add(this.treeSprite);
        this.add(this.tileFluidTop);
        this.add(this.tileFluidMid);
        // this.add(this.treeMask);

        this.fixedUpdate();

        this.maskBitmap = this.treeMask.createBitmapMask();
        this.tileFluidMid.setMask(this.maskBitmap)
        this.tileFluidTop.setMask(this.maskBitmap)
    }

    update(time, delta) {

    }

    frameTime = 0;
    fixedUpdate() {
        this.frameTime++;
        let frame = Math.round(this.frameTime / 3) % 8;

        let v = this.volume[2];
        let tv = TreeVolume[this.size];
        let tvh = TreeVolumeHeight[this.size];

        let ph = (v / tv);
        if (ph > 1) {
            ph = 1;
            if (this.size < 3) {
                this.size++;
                this.volume[2] *= 0.5;
            }
        }

        let h = ph * tvh;

        this.tileFluidTop
            .setTexture('animations', 'top_' + frame)
            .setPosition(-16, -TreeHeight[this.size] - h - 9);
        this.tileFluidMid
            .setTexture('animations', 'middle_' + frame)
            .setPosition(-16, -TreeHeight[this.size] - h + 16 - 9);

        let treeFrame = TreeFrames[this.size];
        let treeMaskFrame = TreeMaskFrames[this.size];

        this.treeSprite
            .setTexture('atlas', treeFrame)

        this.treeMask
            .setTexture('masks', treeMaskFrame)

    }
}

const TreeFrames = ['tree_1', 'tree_2', 'tree_3', 'tree_4'];
const TreeMaskFrames = ['tree_mask_1', 'tree_mask_2', 'tree_mask_3', 'tree_mask_4'];
const TreeHeight = [8, 12, 15, 16];
const TreeVolume = [13*8, 18*12, 26*20, 31*28];
const TreeVolumeHeight = [13, 18, 26, 31];