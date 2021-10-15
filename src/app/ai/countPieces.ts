import { ChessState, Piece, Square } from "../game/models.js";
import { flat } from "../utils/helpers.js";

export type FilterSquare = (s: Square) => boolean;

export type FilterPiece = (p: Piece) => boolean;

export function countSquares(state: ChessState, filterSquare: FilterSquare): number {
    return [...flat(state.board)].filter(sq => filterSquare(sq.value)).length;
} 

 export function countPieces(state: ChessState, filterPiece?: FilterPiece): number {
    const filterSquare = (s: Square) => {
        if(!s.piece) {
            return false;
        }

        if(!filterPiece) {
            return true;
        }

        return filterPiece(s.piece);
    }
    return countSquares(state, filterSquare);
} 