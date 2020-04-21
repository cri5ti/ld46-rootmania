import * as Phaser from 'phaser';
import {PROD} from "../../app/game_config";
import {randAB, randPick} from "../../util/math";
import {createSmoke} from "../particles/particle_smoke";
import {TreeGameObject} from "./tree_obj";

export class ChopperGameObject
    extends Phaser.GameObjects.Container
{
    private target: TreeGameObject;
    private sprite: Phaser.GameObjects.Sprite;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private eventChop: Phaser.Time.TimerEvent;
    private eventChopDone: Phaser.Time.TimerEvent;

    constructor(scene, x, target) {
        super(scene, x, 0);

        this.target = target;

        const truck1 = this.sprite = scene.make.sprite({ x: 0, y: 82 }, true)
            .setTexture('atlas', 'truck_1');

        this.add(truck1);

        const [particles, emitter] = createSmoke(scene);
        this.scene.children.add(particles);
        emitter.startFollow(this, 8);
        this.emitter = emitter;
    }

    state = 'targeting';

    speed = PROD ? 0.008 : 0.1;

    exitTo: number;

    update(time, delta) {
        this.emitter.startFollow(this, this.sprite.flipX ? -8 : 8, 82);
        // this.emitter.follow() = this.x;

        if (this.state == 'targeting') {

            const dist = Math.abs(this.target.x - this.x);
            if (dist < 2) {
                this.state = 'chopping';

                let chops = randAB(5, 10);

                this.eventChop = this.scene.time.addEvent({
                    delay: 1000,
                    repeat: chops,
                    callback: this._chop
                });

                this.eventChopDone = this.scene.time.addEvent({
                    delay: chops * 1000 + 1500,
                    callback: this._chopDone
                });

            } else if (this.x > this.target.x) {
                this.setX(this.x - delta * this.speed);
                this.sprite.flipX = false;
            } else if (this.x < this.target.x) {
                this.setX(this.x + delta * this.speed);
                this.sprite.flipX = true;
            }

        }

        if (this.state == 'leave') {
            const dist = Math.abs(this.exitTo - this.x);
            if (dist < 2) {

                // this.parentContainer.remove(this);
                this.destroy(true);

            } else if (this.x > this.exitTo) {
                this.setX(this.x - delta * this.speed);
                this.sprite.flipX = false;
            } else if (this.x < this.exitTo) {
                this.setX(this.x + delta * this.speed);
                this.sprite.flipX = true;
            }
        }

    }

    _chop = () => {
        if (!this.scene) return;

        if (!this.target.scene) {
            this.eventChop.destroy();
            this.eventChopDone.destroy();
            this._chopDone();
            return;
        }

        this.target.chop();

        PROD && this.scene.sound.play('sfx_chop', { volume: 0.5 });
    }

    _chopDone = () => {
        this.state = 'leave';
        this.exitTo = randPick([-50, 350]);
    };

}
