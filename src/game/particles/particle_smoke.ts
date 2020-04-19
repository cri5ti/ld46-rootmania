import * as Phaser from 'phaser';
import Scene = Phaser.Scene;


export function createEmitterSmoke(scene: Scene) {
    const particles = scene.add.particles('atlas');

    return particles.createEmitter({
        frame: {
            frames: [
                'smoke_1',
                'smoke_2',
                'smoke_3'
            ]
        },

        speed: 0,
        frequency: 50,
        scale: {start: 0.3, end: 1},
        alpha: {start: 0.5, end: 0},
        lifespan: 3000,
        gravityY: -5,
        gravityX: 0,
        blendMode: 'MULTIPLY',
        // on: false
    });
}