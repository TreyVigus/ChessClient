import { ChessState, Color, Square } from "../game/models.js";
import { itemAt, posSequence } from "../utils/helpers.js";

//TODO: can make a decorator that is applied to a function that will track its args and cache if seen before...

export type EvalCache = {
    add(moveColor: Color, state: ChessState, evaluation: number): void,
    /** Returns undefined if not present. */
    get(moveColor: Color, state: ChessState): number | undefined,
    size(): number
}

export function getEmptyCache(): EvalCache {
    const whiteMap: Map<string, number> = new Map();
    const blackMap: Map<string, number> = new Map();

    const add = (moveColor: Color, state: ChessState, evaluation: number) => {
        const ser = serialize(state);
        if(moveColor === 'white') {
            whiteMap.set(ser, evaluation);
        } else {
            blackMap.set(ser, evaluation);
        }
    }

    const get = (moveColor: Color, state: ChessState) => {
        const ser = serialize(state);
        if(moveColor === 'white') {
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
 * @todo unit test
 * */
function serialize(state: ChessState): string {
    let ser = "";
    posSequence().forEach(pos => {
        const sq = itemAt(state.board, pos);
        ser = `${ser}~${serializeSquare(sq)}`
    });
    return ser;
}

function serializeSquare(s: Square): string {
    return `${serializePiece(s.piece)}.${serializeTouched(s.touched)}`;
}

function serializePiece(p: Square['piece']): string {
    return p ? `${p.color},${p.name}` : 'none';
}

function serializeTouched(touched: Square['touched']): string {
    return touched ? 't' : 'f';
}