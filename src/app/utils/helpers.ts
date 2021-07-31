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

/**
 * @param next A function that generates the next element based on the current position.
 * @returns An 8x8 array populated with the generated elements.
 */
export function constructBoard<T>(next: (pos: Position) => T): T[][] {
    const board = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
        let row = [];
        for(let j = 0; j < BOARD_SIZE; j++) {
            row.push(next([i, j]))
        }
        board.push(row);
    }
    return board;
}

/**
 * @param board An 8x8 array
 * 
 * Converts the given 8x8 array to an Iterable, which can be used in a for...of or spread construct.
 */
export function flat<T>(board: T[][]): Iterable<{index: Position, value: T}> {
    const seq = posSequence();
    let currIndex = 0;
    const next: () => IteratorResult<{index: Position, value: T}> = function() {
        if(currIndex === seq.length) {
            return {done: true, value: null}
        }
        const currPos = seq[currIndex];
        const res =  { 
            done: false, 
            value: {
                index: seq[currIndex],
                value: itemAt(board, currPos)
            }
        }
        currIndex++;
        return res;
    }

    return {
        [Symbol.iterator]: function() {
            return { next }
        }
    }
}

export function itemAt<T>(board: T[][], pos: Position): T {
    const [i, j] = pos;
    if(i < 0 || j < 0 || i >= BOARD_SIZE || j >= BOARD_SIZE) {
        throw `Position (${i}, ${j}) is invalid`;
    }
    return board[i][j];
}

/** Return a deep clone of the given object. */
export function clone<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}