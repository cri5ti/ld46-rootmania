import * as Phaser from 'phaser';
import {lerp, randAB} from "../../util/math";
import {SceneGame} from "../scene_game";
import {IFluidObj} from "./fluid_obj";
import {PipeGameObject} from "./pipe_obj";

export class TreeGameObject
    extends Phaser.GameObjects.Container
    implements IFluidObj
{
    pipe: PipeGameObject;

    flowMask = [0, 0, 0, 0];
    id = "tree";
    pressure = [0, 0, -255, 0];
    volume = [0, 0, 0, 0];

    scene: SceneGame;

    private tileFluidTop: Phaser.GameObjects.TileSprite;
    private tileFluidMid: Phaser.GameObjects.TileSprite;
    public treeSize: int;
    private treeSprite: Phaser.GameObjects.Sprite;
    private treeMask: Phaser.GameObjects.Image;
    private maskBitmap: Phaser.Display.Masks.BitmapMask;
    tx: any;

    constructor(scene: SceneGame, tx, size: int) {
        super(scene, tx*16, 0);
        this.tx = tx;

        this.treeSize = size;
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
        // DEBUG && this.pipe && this.pipe._debug();

        this.frameTime++;
        let frame = Math.round(this.frameTime / 3) % 8;

        if (this.volume[2] > 0)
            this.volume[2] = this.volume[2] - 3;

        if (this.pipe) {
            this.volume[2] += this.pipe.debit[0] * (1/64);
        }

        // if (this.volume[2] < 0) this.volume[2] = 0;
        // console.log(this.volume[2]);

        this.setAlpha(this.volume[2] ? lerp(this.volume[2], 0, DeathVolume, 1, 0) : 1);

        let v = this.volume[2];
        let tv = TreeVolume[this.treeSize];
        let tvh = TreeVolumeHeight[this.treeSize];

        let ph = (v / tv);
        if (ph > 1) {
            ph = 1;
            if (this.treeSize < 3) {
                this.scene.sound.play('sfx_grow');
                this.treeSize++;
                this.volume[2] *= 0.5;
            }
        }

        let h = ph * tvh;

        this.tileFluidTop
            .setTexture('animations', 'top_' + frame)
            .setPosition(-16, -TreeHeight[this.treeSize] - h - 9);
        this.tileFluidMid
            .setTexture('animations', 'middle_' + frame)
            .setPosition(-16, -TreeHeight[this.treeSize] - h + 16 - 9);

        let treeFrame = TreeFrames[this.treeSize];
        let treeMaskFrame = TreeMaskFrames[this.treeSize];

        this.treeSprite
            .setTexture('atlas', treeFrame)

        this.treeMask
            .setTexture('masks', treeMaskFrame)

    }

    chop() {
        if (!this.scene) return;

        this.volume[2] = this.volume[2] - randAB(50, 150);

        if (this.volume[2] < DeathVolume) {
            this.scene.pipeMap.killTree(this);
            return;
        }

        this.scene.tweens.add({
            targets: [ this ],
            angle: -5,
            ease: 'Sine.easeInOut',
            duration: 20,
            yoyo: true,
            repeat: 5
        });

        this.treeSprite.setTint(0xff0000);
        this.scene.time.addEvent({
            delay: 100,
            callback: () => this.treeSprite.clearTint()
        });
    }
}

const TreeFrames = ['tree_1', 'tree_2', 'tree_3', 'tree_4'];
const TreeMaskFrames = ['tree_mask_1', 'tree_mask_2', 'tree_mask_3', 'tree_mask_4'];
const TreeHeight = [8, 12, 15, 16];
const TreeVolume = [100, 300, 600, 800];
const TreeVolumeHeight = [13, 18, 26, 31];
const DeathVolume = -200;