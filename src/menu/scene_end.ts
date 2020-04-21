import * as Phaser from "phaser";


class SceneEnd extends Phaser.Scene
{
    key ='quote'
    private _logo: Phaser.GameObjects.Text;

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const text = this.add
            .text(w/2, h/2, '“You can’t have fruits without the trees either.”', {
                align: 'center',
                fill: '#aaa',
                fontFamily: 'Arial',
                fontSize: 12
            })
            .setAlpha(0)
            .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: [ text ],
            alpha: { from: 0, to: 1 },
            ease: 'Sine.easeOut',
            delay: 500,
            duration: 5000
        });

        this.input.on('pointerdown', () => {
            const s2 = this.scene.switch('menu');
            s2.get('menu').cameras.main.fadeIn(1000);
        }, this);

    }

    update() {}

}


export default new SceneEnd({key: 'end'});