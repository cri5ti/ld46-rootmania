
export const enum Feat {
    Water = 0b0_1_0000,
    PipeNE = 0b0_0011,
    PipeNS = 0b0_0101,
    PipeES = 0b0_0110,
    PipeNES = 0b0_0111,
    PipeNW = 0b0_1001,
    PipeEW = 0b0_1010,
    PipeNEW = 0b0_1011,
    PipeSW = 0b0_1100,
    PipeNSW = 0b0_1101,
    PipeESW = 0b0_1110,
    PipeNESW = 0b0_1111,
}

export const enum Dir {
    N = 0,
    E = 1,
    S = 2,
    W = 3
}

export const DirXY = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
]

export function isWater(n: int) {
    return (n & 0b1_0000) > 0;
}

export function isPipe(n: int) {
    return (n & 0b1111) > 0;
}

export function isPipeN(n: int) {
    return (n & 0b0001) > 0;
}

export function isPipeE(n: int) {
    return (n & 0b0010) > 0;
}

export function isPipeS(n: int) {
    return (n & 0b0100) > 0;
}

export function isPipeW(n: int) {
    return (n & 0b1000) > 0;
}

export const PipeTile = {
    // horizontal, vertical
    [Feat.PipeNS]: {frame: 'pipe_NS', deg: 0},
    [Feat.PipeEW]: {frame: 'pipe_NS', deg: 1},

    // corner
    [Feat.PipeNE]: {frame: 'pipe_NE', deg: 0},
    [Feat.PipeES]: {frame: 'pipe_NE', deg: 1},
    [Feat.PipeSW]: {frame: 'pipe_NE', deg: 2},
    [Feat.PipeNW]: {frame: 'pipe_NE', deg: 3},

    // 3
    [Feat.PipeNES]: {frame: 'pipe_NES', deg: 0},
    [Feat.PipeESW]: {frame: 'pipe_NES', deg: 1},
    [Feat.PipeNSW]: {frame: 'pipe_NES', deg: 2},
    [Feat.PipeNEW]: {frame: 'pipe_NES', deg: 3},

    // 4
    [Feat.PipeNESW]: {frame: 'pipe_NESW', deg: 0},
};

