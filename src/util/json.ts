

export function tweakJsonCoords(json) {

    const slices = json.meta.slices.reduce((r, i) => {
        r[i.name] = i.keys[0];
        return r
    }, {});

    for (let k in json.frames) {
        let f = json.frames[k];

        let s = slices[k];

        if (s) {
            f.spriteSourceSize.x = -s.pivot.x + (f.spriteSourceSize.x % 16);
            f.spriteSourceSize.y = -s.pivot.y + (f.spriteSourceSize.y % 16);
            f.sourceSize.w = f.spriteSourceSize.w;
            f.sourceSize.h = f.spriteSourceSize.h;
        } else {
            f.spriteSourceSize.x = (f.spriteSourceSize.x % 16);
            f.spriteSourceSize.y = (f.spriteSourceSize.y % 16);
            f.sourceSize.w = f.spriteSourceSize.w;
            f.sourceSize.h = f.spriteSourceSize.h;
        }
    }

    return json;

}