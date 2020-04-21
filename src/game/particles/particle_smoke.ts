import * as Phaser from 'phaser';
import Scene = Phaser.Scene;
import ParticleEmitterManager = Phaser.GameObjects.Particles.ParticleEmitterManager;
import ParticleEmitter = Phaser.GameObjects.Particles.ParticleEmitter;


export function createSmoke(scene: Scene): [ParticleEmitterManager, ParticleEmitter] {
    const particles = scene.make.particles({}, false)
        .setTexture('atlas');

    const emitter = particles.createEmitter({
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
        alpha: {start: 0.3, end: 0},
        lifespan: 3000,
        gravityY: -5,
        gravityX: 0,
        blendMode: 'MULTIPLY',
        // on: false
    });

    return [particles, emitter]
}