
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

export const DirOpposite = [
    /*N = / Dir.S,
    /*E =*/ Dir.W,
    /*S =*/ Dir.N,
    /*W =*/ Dir.E
];

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

const DirBitmask = [ /*N =*/ 0b0001, /*E =*/ 0b0010, /*S =*/ 0b0100, /*W =*/ 0b1000 ];

export function isPipeOpen(pipeMask: int, dir: int /* 0-3 */) {
    const dirMask = DirBitmask[dir];
    return (pipeMask & dirMask) > 0;
}

export const PipeFrame = {
    // horizontal, vertical
    [Feat.PipeNS]: 'pipe_0101',
    [Feat.PipeEW]: 'pipe_1010',

    // corner
    [Feat.PipeNE]: 'pipe_0011',
    [Feat.PipeES]: 'pipe_0110',
    [Feat.PipeSW]: 'pipe_1100',
    [Feat.PipeNW]: 'pipe_1001',

    // 3
    [Feat.PipeNES]: 'pipe_0111',
    [Feat.PipeESW]: 'pipe_1110',
    [Feat.PipeNSW]: 'pipe_1101',
    [Feat.PipeNEW]: 'pipe_1011',

    // 4
    [Feat.PipeNESW]: 'pipe_1111',
};

export const PipeExits = {
    [Feat.PipeNS]: 2,
    [Feat.PipeEW]: 2,
    [Feat.PipeNE]: 2,
    [Feat.PipeES]: 2,
    [Feat.PipeSW]: 2,
    [Feat.PipeNW]: 2,
    // 3
    [Feat.PipeNES]: 3,
    [Feat.PipeESW]: 3,
    [Feat.PipeNSW]: 3,
    [Feat.PipeNEW]: 3,
    // 4
    [Feat.PipeNESW]: 4,
};

// export const MaskTile = {
//     // horizontal, vertical
//     [Feat.PipeNS]: {frame: 'pipe_NS', deg: 0},
//     [Feat.PipeEW]: {frame: 'pipe_NS', deg: 1},
//
//     // corner
//     [Feat.PipeNE]: {frame: 'pipe_NE', deg: 0},
//     [Feat.PipeES]: {frame: 'pipe_NE', deg: 1},
//     [Feat.PipeSW]: {frame: 'pipe_NE', deg: 2},
//     [Feat.PipeNW]: {frame: 'pipe_NE', deg: 3},
//
//     // 3
//     [Feat.PipeNES]: {frame: 'pipe_NES', deg: 0},
//     [Feat.PipeESW]: {frame: 'pipe_NES', deg: 1},
//     [Feat.PipeNSW]: {frame: 'pipe_NES', deg: 2},
//     [Feat.PipeNEW]: {frame: 'pipe_NES', deg: 3},
//
//     // 4
//     [Feat.PipeNESW]: {frame: 'pipe_NESW', deg: 0},
// };

export const Rad90 = Math.PI/2;
