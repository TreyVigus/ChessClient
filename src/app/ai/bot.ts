import { Player } from "../game/gameLoop.js";
import { ChessState, Color } from "../game/models.js";
import { MoveEvent } from "../view/boardView.js";
import { allLegalMoves } from "./moveGenerator.js";

export function simpleMindedBot(color: Color): Player {
    return {
        move: (prevPly: MoveEvent | undefined, state: ChessState) => {
            return new Promise<MoveEvent>((resolve) => {
                setTimeout(() => {
                    resolve(randomMove(prevPly, state, color));
                }, 500)
            });
        }
    }
}

/** Returns a random legal move for the given color. */
function randomMove(prevPly: MoveEvent | undefined, state: ChessState, botColor: Color): MoveEvent {
    const legal = allLegalMoves(prevPly, state, botColor);
    return legal[Math.floor(Math.random()*legal.length)];
}