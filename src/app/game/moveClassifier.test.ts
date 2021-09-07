import { createTestGroup } from "../../testing/test-execution.js";
import { emptyState, setPiece } from "../../testing/test-helpers.js";
import { MoveEvent } from "../view/boardView.js";
import { ChessState } from "./models.js";
import { classifyMove } from "./moveClassifier.js";

let state: ChessState;

const tg = createTestGroup('Move Classifier Testing', () => {
    state = emptyState();
});

tg.add('non pawn move is normal move', () => {
    setPiece(state, [4, 3], {color: 'black', name: 'bishop'});
    const attempedMove = {
        startPos: [4, 3],
        endPos: [0, 7]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'normal';
});

tg.add('white pawn single forward', () => {
    setPiece(state, [3, 7], {color: 'white', name: 'pawn'});
    const attempedMove = {
        startPos: [3, 7],
        endPos: [2, 7]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnSingleForward';
});

tg.add('black pawn single forward', () => {
    setPiece(state, [3, 7], {color: 'black', name: 'pawn'});
    const attempedMove = {
        startPos: [3, 7],
        endPos: [4, 7]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnSingleForward';
});

tg.add('white pawn double forward', () => {
    setPiece(state, [6, 7], {color: 'white', name: 'pawn'});
    const attempedMove = {
        startPos: [6, 7],
        endPos: [4, 7]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnDoubleForward';
});

tg.add('black pawn double forward', () => {
    setPiece(state, [2, 3], {color: 'black', name: 'pawn'});
    const attempedMove = {
        startPos: [2, 3],
        endPos: [4, 3]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnDoubleForward';
});

tg.add('pawn moving backward is classified as normal', () => {
    setPiece(state, [3, 7], {color: 'black', name: 'pawn'});
    const attempedMove = {
        startPos: [3, 7],
        endPos: [2, 7]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'normal';
});

tg.add('white pawn moving one square to the right is classified as normal', () => {
    setPiece(state, [3, 7], {color: 'white', name: 'pawn'});
    const attempedMove = {
        startPos: [3, 7],
        endPos: [3, 6]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'normal';
});

tg.add('white pawn normal capture 1', () => {
    setPiece(state, [2, 5], {color: 'white', name: 'pawn'});
    const attempedMove = {
        startPos: [2, 5],
        endPos: [1, 6]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('white pawn normal capture 2', () => {
    setPiece(state, [1, 1], {color: 'white', name: 'pawn'});
    setPiece(state, [0, 0], {color: 'black', name: 'bishop'});
    const attempedMove = {
        startPos: [1, 1],
        endPos: [0, 0]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('black pawn normal capture 1', () => {
    setPiece(state, [4, 3], {color: 'black', name: 'pawn'});
    const attempedMove = {
        startPos: [4, 3],
        endPos: [5, 4]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('black pawn capturing backwards is classified as normal', () => {
    setPiece(state, [4, 3], {color: 'black', name: 'pawn'});
    const attempedMove = {
        startPos: [4, 3],
        endPos: [3, 2]
    }
    const classification = classifyMove(undefined, state, attempedMove as MoveEvent);
    return classification === 'normal';
});

tg.add('white pawn en passant 1', () => {
    setPiece(state, [3, 6], {color: 'black', name: 'pawn'});
    const previousMove = {
        startPos: [1, 6],
        endPos: [3, 6]
    }
    setPiece(state, [3, 7], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [3, 7],
        endPos: [2, 6]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnPassantCapture';
});

tg.add('white pawn en passant 2', () => {
    setPiece(state, [3, 2], {color: 'black', name: 'pawn'});
    const previousMove = {
        startPos: [1, 2],
        endPos: [3, 2]
    }
    setPiece(state, [3, 1], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [3, 1],
        endPos: [2, 2]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnPassantCapture';
});

tg.add('black pawn en passant 1', () => {
    setPiece(state, [4, 4], {color: 'white', name: 'pawn'});
    const previousMove = {
        startPos: [6, 4],
        endPos: [4, 4]
    }
    setPiece(state, [4, 5], {color: 'black', name: 'pawn'});
    const attemptedMove = {
        startPos: [4, 5],
        endPos: [5, 4]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnPassantCapture';
});

tg.add('black pawn en passant 2', () => {
    setPiece(state, [4, 2], {color: 'white', name: 'pawn'});
    const previousMove = {
        startPos: [6, 2],
        endPos: [4, 2]
    }
    setPiece(state, [4, 1], {color: 'black', name: 'pawn'});
    const attemptedMove = {
        startPos: [4, 1],
        endPos: [5, 2]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnPassantCapture';
});

tg.add('black pawn en passant 2', () => {
    setPiece(state, [4, 2], {color: 'white', name: 'pawn'});
    const previousMove = {
        startPos: [6, 2],
        endPos: [4, 2]
    }
    setPiece(state, [4, 1], {color: 'black', name: 'pawn'});
    const attemptedMove = {
        startPos: [4, 1],
        endPos: [5, 2]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnPassantCapture';
});

tg.add('not classified as en passant unless previous move was pawn double forward', () => {
    setPiece(state, [3, 6], {color: 'black', name: 'pawn'});
    const previousMove = {
        startPos: [0, 7],
        endPos: [1, 7]
    }
    setPiece(state, [3, 7], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [3, 7],
        endPos: [2, 6]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('not classified as en passant if prev pawn move was capture', () => {
    const previousMove = {
        startPos: [1, 3],
        endPos: [2, 2]
    }
    setPiece(state, [2, 2], {color: 'black', name: 'pawn'});
    setPiece(state, [2, 3], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [2, 3],
        endPos: [1, 2]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('not classified as en passant if prev pawn move was not from starting position 1', () => {
    const previousMove = {
        startPos: [2, 1],
        endPos: [4, 1]
    }
    setPiece(state, [4, 1], {color: 'black', name: 'pawn'});
    setPiece(state, [4, 2], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [4, 2],
        endPos: [3, 1]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('not classified as en passant if prev pawn move was not from starting position 1', () => {
    const previousMove = {
        startPos: [4, 5],
        endPos: [2, 5]
    }
    setPiece(state, [2, 5], {color: 'white', name: 'pawn'});

    setPiece(state, [2, 6], {color: 'black', name: 'pawn'});
    const attemptedMove = {
        startPos: [2, 6],
        endPos: [3, 5]
    }
    const classification = classifyMove(previousMove as MoveEvent, state, attemptedMove as MoveEvent);
    return classification === 'pawnNormalCapture';
});

tg.add('white pawn promotion', () => {
    setPiece(state, [1,6], {color: 'white', name: 'pawn'});
    const attemptedMove = {
        startPos: [1, 6],
        endPos: [0, 6]
    }
    const classification = classifyMove(undefined, state, attemptedMove as MoveEvent);
    return classification === 'pawnPromote';
});

tg.add('black pawn promotion', () => {
    setPiece(state, [6, 0], {color: 'black', name: 'pawn'});
    const attemptedMove = {
        startPos: [6, 0],
        endPos: [7, 0]
    }
    const classification = classifyMove(undefined, state, attemptedMove as MoveEvent);
    return classification === 'pawnPromote';
});

tg.execute();