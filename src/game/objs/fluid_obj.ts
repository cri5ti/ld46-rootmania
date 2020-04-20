
export interface IFluidObj {
    id: string,
    pressure: int[]; // -255..255
    volume: int[]; // -255..255 (rolling over, modulo 255)
    flowMask: int[]; // 16 bits per direction
}

