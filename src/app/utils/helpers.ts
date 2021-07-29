import { Color, Position } from "../game/models.js";
import { BOARD_SIZE } from "../view/boardView.js";

export function oppositeColor(color: Color): Color {
    if(color === 'white') {
        return 'black';
    }
    return 'white';
}

export function posColor(pos: Position): Color {
    const evenRow = pos[0] % 2 === 0;
    const evenCol = pos[1] % 2 === 0;
    if(evenRow) {
        return evenCol ? 'white' : 'black';
    } else {
        return evenCol ? 'black' : 'white';
    }
}

export function posEquals(pos1: Position, pos2: Position): boolean {
    return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

/** 
 * Return a list of positions representing the coordinates of an 8x8 board.
 * (0,0), (0,1), (0,2)...
 * */
export function posSequence(): Position[] {
    const seq: Position[] = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            seq.push([i, j]);
        }
    }
    return seq;
}