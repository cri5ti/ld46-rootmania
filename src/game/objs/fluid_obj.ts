
export interface IFluidObj {
    pressure: [int, int, int, int]; // -255..255
    volume: [int, int, int, int]; // -255..255 (rolling over, modulo 255)
    flowMask: [int, int, int, int]; // 16 bits per direction
}


export const waterSpout: IFluidObj = {
    pressure: [255, 255, 255, 255],
    volume: [0, 0, 0, 0],
    flowMask: [0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF]
}
