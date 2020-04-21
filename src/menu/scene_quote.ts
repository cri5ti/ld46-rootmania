import * as Phaser from "phaser";


class SceneQuote extends Phaser.Scene
{
    key ='quote'
    private _logo: Phaser.GameObjects.Text;

    create() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;

        const text = this.add
            .text(w/2, h/2, '“You can’t have fruits without the roots.”', {
                align: 'center',
                fill: '#7f7',
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
            duration: 2000
        });

        this.input.on('pointerdown', () => {
            const s2 = this.scene.switch('game');
            s2.get('game').cameras.main.fadeIn(1000);
        }, this);

    }

    update() {}

}


export default new SceneQuote({key: 'quote'});