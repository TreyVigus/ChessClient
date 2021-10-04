import { ChessState, Color } from "../game/models.js";
import { MoveEvent } from "../view/boardView.js";
import { allLegalMoves } from "./moveGenerator.js";

export type GetBotMove = (precedingMove: MoveEvent | undefined, state: ChessState, botColor: Color) => Promise<MoveEvent>;

export const getBotMove: GetBotMove = (precedingMove: MoveEvent | undefined, state: ChessState, botColor: Color) => {
    return Promise.resolve(randomMove(precedingMove, state, botColor));
}

/** Returns a random legal move for the given color. */
export function randomMove(precedingMove: MoveEvent | undefined, state: ChessState, botColor: Color): MoveEvent {
    const legal = allLegalMoves(precedingMove, state, botColor);
    return legal[Math.floor(Math.random()*legal.length)];
}