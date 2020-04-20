import * as Phaser from 'phaser';
import {IFluidObj} from "./fluid_obj";

// export class WaterSpoutGameObject extends Phaser.GameObjects.Container
// {
//     constructor(scene) {
//         super(scene, 0, 0);
//     }
//
//     update(time, delta) {}
// }


export const waterSpout: IFluidObj = {
    id: '💧',
    pressure: [255, 255, 255, 255],
    volume: [0, 0, 0, 0],
    flowMask: [0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF]
}
