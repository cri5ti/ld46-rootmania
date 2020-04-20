import * as Phaser from "phaser";
import sceneGame from "../game/scene_game";
import sceneMenu from "../menu/scene_menu";


export const PROD = process.env.NODE_ENV !== 'development';
// export const PROD = true;

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
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
    // plugins: {
    //     global: [
    //         { key: 'PipePlugin', plugin: PipePlugin, start: true }
    //     ]
    // },
    // scene: [sceneMenu, sceneGame]
    scene:  !PROD ? [sceneGame] : [sceneMenu, sceneGame]
};


export default gameConfig;