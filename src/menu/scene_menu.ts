import * as Phaser from "phaser";
import {tweakJsonCoords} from "../util/json";
import Tween = Phaser.Tweens.Tween;


class SceneMenu extends Phaser.Scene
{
    key: 'menu'
    private _logo: Phaser.GameObjects.Text;

    preload() {
        this.load.image('title1', 'assets/title1.png');
        this.load.image('title2', 'assets/title2.png');
        this.load.image('title_bg', 'assets/title_bg.png');
    }

    create() {
        // this.add.image(400, 150, 'star').setScale(5);

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const bg = this.add
            .image(0, 0, 'title_bg')
            .setOrigin(0, 0);

        const title1 = this.add.image(w/2, 80, 'title1').setAlpha(0)
        const title2 = this.add.image(w/2, 80, 'title2').setAlpha(0)

        this.tweens.add({
            targets: [ title1 ],
            y: { from: 70, to: 80 },
            alpha: { from: 0, to: 1 },
            ease: 'Sine.easeOut',
            duration: 1000
        });

        this.tweens.add({
            targets: [ title2 ],
            y: { from: 70, to: 75 },
            alpha: { from: 0, to: 1 },
            ease: 'Sine.easeOut',
            delay: 600,
            duration: 800
        });


        const text1 = this.add
            .text(w/2, 155, 'A Ludum Dare 46 game', {
                align: 'center',
                fill: '#fff',
                fontFamily: 'Arial',
                fontSize: 10
            })
            .setAlpha(0)
            .setOrigin(0.5, 0);

        const text2 = this.add
            .text(w/2, 180, 'Click to start', {
                align: 'center',
                fill: '#FF3',
                fontFamily: 'Arial',
                fontSize: 12
            })
            .setAlpha(0)
            .setOrigin(0.5, 0);

        this.tweens.add({
            targets: [ text2 ],
            scale: 1.1,
            duration: 400,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });


        this.tweens.add({
            targets: [ text1 ],
            alpha: { from: 0, to: 1 },
            ease: 'Sine.easeOut',
            delay: 1800,
            duration: 2000
        });

        this.tweens.add({
            targets: [ text2 ],
            alpha: { from: 0, to: 1 },
            ease: 'Sine.easeOut',
            delay: 4000,
            duration: 2000
        });


        this.input.on('pointerdown', () => {
            const s2 = this.scene.switch('quote');
            s2.get('game').cameras.main.fadeIn(1000);
        }, this);

    }

    update() {}

}


export default new SceneMenu({key: 'menu'});