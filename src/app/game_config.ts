import * as Phaser from "phaser";
import sceneGame from "../game/scene_game";
import sceneMenu from "../menu/scene_menu";
import sceneQuote from "../menu/scene_quote";
import sceneEnd from "../menu/scene_end";


// export const PROD = process.env.NODE_ENV !== 'development';
export const PROD = true;

export const DEBUG = false;

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
    scene:
        // !PROD ? [sceneGame] :
        [sceneMenu, sceneQuote, sceneGame, sceneEnd]
};


export default gameConfig;