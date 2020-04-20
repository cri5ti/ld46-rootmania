
export function lerp(x, a, b, u, v) {
    let t = (x - a) / (b - a);
    return t * (v - u) + u;
}



export function randXY(x1: int, y1: int, x2: int, y2: int): [int, int] {
    return [randAB(x1, x2), randAB(y1, y2)];
}

export function randAB(a: int, b: int): int {
    return rand0N(b - a) + a;
}

export function rand0N(n: int): int {
    return (Math.random() * n) | 0;
}

export function randPick<T>(arr:T[]):T {
    return arr[rand0N(arr.length)];
}

