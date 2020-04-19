import * as Phaser from "phaser";
import Tween = Phaser.Tweens.Tween;


class SceneMenu extends Phaser.Scene
{
    key: 'menu'
    private _logo: Phaser.GameObjects.Text;

    create() {
        // this.add.image(400, 150, 'star').setScale(5);

        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const logo = this.add
            .text(w/2, h*0.25, 'LD46', {
                align: 'center',
                fill: '#06f',
                fontFamily: 'Arial',
                fontSize: 24
            })
            .setOrigin(0.5, 0);


        const text2 = this.add
            .text(w/2, h*0.7, 'Click to start', {
                align: 'center',
                fill: 'lime',
                fontFamily: 'Arial',
                fontSize: 12
            })
            .setOrigin(0.5, 0);

        this.tweens.add({
            targets: [ text2 ],
            scale: 1.1,
            duration: 400,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.input.on('pointerdown', () => {

            const s2 = this.scene.switch('game');
            s2.get('game').cameras.main.fadeIn(1000);
        }, this);

    }

    update() {
        // const s = Math.cos(this.game.getTime() / 1000);
        // console.log(s);
        // this._logo.scale = this.game.getTime();
    }

}


export default new SceneMenu({key: 'menu'});