import { ChessState, Color, Square } from "../game/models.js";
import { itemAt, posSequence } from "../utils/helpers.js";
import { EvalResult } from "./minimaxBot.js";

//TODO: can make a decorator that is applied to a function that will track its args and cache if seen before...

export type EvalCache = {
    add(moveColor: Color, state: ChessState, evaluation: EvalResult): void,
    /** Returns undefined if not present. */
    get(moveColor: Color, state: ChessState): EvalResult | undefined,
    size(): number
}

export function getEmptyCache(): EvalCache {
    const whiteMap: Map<string, EvalResult> = new Map();
    const blackMap: Map<string, EvalResult> = new Map();

    const add = (moveColor: Color, state: ChessState, evaluation: EvalResult) => {
        const ser = serialize(state);
        if(moveColor === 2) {
            whiteMap.set(ser, evaluation);
        } else {
            blackMap.set(ser, evaluation);
        }
    }

    const get = (moveColor: Color, state: ChessState) => {
        const ser = serialize(state);
        if(moveColor === 2) {
            return whiteMap.get(ser);
        } else {
            return blackMap.get(ser);
        }
    }

    const size = () => {
        return whiteMap.size + blackMap.size;
    }

    return { add, get, size };
}

/** 
 * OPT: could make this return a unique integer for a state. 
 * currently this returns ~ 383 character string
 * can represent any square with a unique number
 * need to find a way to 'build' a hash, square by square
 * https://en.wikipedia.org/wiki/Rolling_hash
 * @todo unit test
 * */
function serialize(state: ChessState): string {
    let ser: string[] = new Array(64);
    posSequence().forEach((pos, index) => {
        const sq = itemAt(state.board, pos);
        ser[index] = serializeSquare(sq);
    });
    return ser.join('');
}

function serializeSquare(s: Square): string {
    return `${serializePiece(s.piece)}${serializeTouched(s.touched)}`;
}

function serializePiece(p: Square['piece']): string {
    return p ? `${p.name}${p.color}` : '00';
}

function serializeTouched(touched: Square['touched']): string {
    return touched ? 't' : 'f';
}