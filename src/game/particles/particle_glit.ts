import * as Phaser from 'phaser';
import Scene = Phaser.Scene;


export function createEmitterGlitter(scene: Scene) {
    const particles = scene.add.particles('atlas');
    particles.setDepth(1);

    return particles.createEmitter({
        frame: {
            frames: [
                'glit_1',
                'glit_2',
                'glit_3',
                'glit_4'
            ]
        },

        speed: 20,
        radial: true,
        // emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 10) },
        frequency: 8,
        scale: { min: 0.5, max: 1 },
        alpha: { start: 0.7, end: 0},
        lifespan: 500,
        gravityY: 0,
        gravityX: 0,
        blendMode: 'ADD',
        // on: false
    });
}