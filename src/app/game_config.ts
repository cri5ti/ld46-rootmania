import * as Phaser from "phaser";
import sceneGame from "../game/scene_game";
import sceneMenu from "../menu/scene_menu";



const gameConfig: Phaser.Types.Core.GameConfig = {
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
    // scene: [sceneMenu, sceneGame]
    scene:  (process.env.NODE_ENV === 'development') ? [sceneGame] : [sceneMenu, sceneGame]
};


export default gameConfig;