import * as Phaser from 'phaser';


const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 320,
    height: 240,
    zoom: 3,
    parent: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    render: {
      pixelArt: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload (this: Phaser.Scene)
{
    this.load.image('bg1', require('./res/bg1.png'));
    this.load.image('tiles1', require('./res/piples1.png'))

    this.load.atlas('atlas', require('./res/atlas.png'), require('./res/atlas.json'));
    // atlas.spritesheet('p1');
    // atlas.spritesheet('p2');
    // atlas.spritesheet('p3');
}


let i: Phaser.GameObjects.Image;

function create ()
{
    this.add.image(160, 100, 'bg1');

    const width = 20;
    const height = 8;

    const map = this.make.tilemap({
        key: 'map',
        tileWidth: 16,
        tileHeight: 16,
        data: new Array(height).fill(0).map(() => new Array(width).fill(0))
    });
    const tileset = map.addTilesetImage('set1', 'tiles1', 16, 16);

    const layer = map.createDynamicLayer('layer', 'set1', 0, 80);

    layer.layer.width = width;
    layer.layer.height = height;

    for (let y = 0; y < layer.layer.height; y++) {
        for (let x = 0; x < layer.layer.width; x++) {
            let t = layer.getTileAt(x, y, true);

            const ix = Math.random()*5 | 0;
            t.index = ix;
            t.flipX = Math.random()*2 > 1 ? true : false;
            t.flipY = Math.random()*2 > 1 ? true : false;
            layer.putTileAt(t, x, y);
        }
    }








    const particles = this.add.particles('atlas');

    const emitter = particles.createEmitter({
        frame: {
          frames: [
              'particle1',
              'particle2',
              'particle3'
          ]
        },
        // speed: 200,
        // maxParticles: 30,
        // lifespan: 0,
        // delay: 100,


        // blendMode: 'ADD'
        speed: 1,
        // delay: 50,
        frequency: 50,
        scale: {start: 1, end: 2},
        alpha: {start: 1, end: 0},
        lifespan: 1000,
        gravityY: -50,
        gravityX: -10,
        // speedX: -20000,
        blendMode: 'ADD',
        on: false,
        // visible: false,
    });

    // const logo = this.physics.add.image(400, 100, 'logo');
    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);


    for(let i=0;i<4;i++) {
        const f = ["p1", "p2", "p3", "p4"][Math.random()*4|0]
        const img = this.add.image(10 + i*20, 230, 'atlas', f);
        img.setInteractive();
        this.input.setDraggable(img);
    }


    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        emitter.startFollow(gameObject);
        gameObject.x = dragX;
        gameObject.y = dragY;
        emitter.on = true;
    });

    this.input.on('dragend', function (pointer, gameObject, dragX, dragY) {
        // emitter.active = false;
        emitter.on = false;
    });



}

let f = 0;
// let z = 1;
function update() {

    // z += 0.005;
    // this.cameras.main.setZoom(z);

    // f++;
    // i.setFrame(f%4);
    // i.frame.
}


type int = number;

class Map
{
    w:int;
    h:int;


}





