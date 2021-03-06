
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
    /*N =*/ Dir.S,
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


export const PIPE_MASKS = {
    // straight (class a)
    [Feat.PipeEW]: [null, {c: 'a', x: 0}, null, {c: 'a', x: 0}], // checked
    [Feat.PipeNS]: [{c: 'a', x: 0}, null, {c: 'a', x: 0}, null],

    // corners (class b)
    [Feat.PipeNE]: [{c: 'b', x: 0}, {c: 'b', x: 1}, null, null],
    [Feat.PipeES]: [null, {c: 'b', x: 0}, {c: 'b', x: 1}, null],
    [Feat.PipeSW]: [null, null, {c: 'b', x: 0}, {c: 'b', x: 1}],
    [Feat.PipeNW]: [{c: 'b', x: 1}, null, null, {c: 'b', x: 0}], // checked

    // tri
    [Feat.PipeNES]: [{c: 'c', x: 0}, {c: 'd', x: 0}, {c: 'c', x: 1}, null], // checked
    [Feat.PipeESW]: [null, {c: 'c', x: 0}, {c: 'd', x: 0}, {c: 'c', x: 1}],
    [Feat.PipeNSW]: [{c: 'c', x: 1}, null, {c: 'c', x: 0}, {c: 'd', x: 0}],
    [Feat.PipeNEW]: [{c: 'd', x: 0}, {c: 'c', x: 1}, null, {c: 'c', x: 0}], // checked

    // quad (class c)
    [Feat.PipeNESW]: [{c: 'b', x: 0}, {c: 'b', x: 0}, {c: 'b', x: 0}, {c: 'b', x: 0}],
};

export const MASK2 = new Array(16).fill(0).map((_, i) => (1 << (i + 1)) - 1);


export const Rad90 = Math.PI/2;
