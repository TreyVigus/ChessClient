import { ChessState } from "../game/models.js";
import { MoveEvent } from "../view/boardView.js";
import { allLegalMoves } from "./moveGenerator.js";

export async function getBotMove(precedingMove: MoveEvent | undefined, state: ChessState): Promise<MoveEvent> {
    return Promise.resolve(randomMove(precedingMove, state));
}

/** Returns a random legal move for the given color. */
export function randomMove(precedingMove: MoveEvent | undefined, state: ChessState): MoveEvent {
    const legal = allLegalMoves(precedingMove, state, 'black');
    return legal[Math.floor(Math.random()*legal.length)];
}