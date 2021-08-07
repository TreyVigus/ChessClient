import { MoveEvent } from "../view/boardView.js";
import { ChessState } from "./models.js";

export type MoveType = 'castle' | 'promote' | 'pawnDouble' | 'passant' | 'other';

/** 
 * Determine the type of the attemptedMove. This has nothing to do with its legality. 
 * Assumes there is a piece at attemptedMove.startPos.
 * */
export function classifyMove(precedingMove: MoveEvent | undefined, currentState: ChessState, attemptedMove: MoveEvent): MoveType {
    //e.g. a move can be classified as 'castle' if the king attempts to move right two squares from start pos.
   return 'other';
}