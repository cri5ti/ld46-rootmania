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
    // this.load.spritesheet('p1', require('./res/piples1.png'), {
    //     frameWidth: 16, frameHeight: 16
    // });
    this.load.image('tiles1', require('./res/piples1.png'))

}


let i: Phaser.GameObjects.Image;

function create ()
{
    this.add.image(160, 100, 'bg1');
    // i = this.add.image(100, 150, 'p1');

    const width = 20;
    const height = 8;

    let data = new Array(height);
    for (let y = 0; y < height; y++) {
        let row = data[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            row[x] = Math.random()*5 | 0;
        }
    }

    // this.cameras.main.setBounds(0, 0, 500, 100);
    // this.cameras.main.setZoom(1);


    const map = this.make.tilemap({
        tileWidth: 16,
        tileHeight: 16,
        width,
        height,
        data
    });

    const tileset = map.addTilesetImage('world1', 'tiles1');

    const layer = map.createStaticLayer('layer', tileset, 0, 0);
    layer.y = 80;



    // map.layer.data = data;
    // map.data = data;


    // const particles = this.add.particles('red');
    //
    // const emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: {start: 1, end: 0},
    //     blendMode: 'ADD'
    // });

    // const logo = this.physics.add.image(400, 100, 'logo');
    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);

    // emitter.startFollow(logo);

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