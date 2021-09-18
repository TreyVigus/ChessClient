import { createTestGroup } from "../../../testing/test-execution.js";
import { arrayEquals, emptyState, positionComparator, setPiece } from "../../../testing/test-helpers.js";
import { posEquals } from "../../utils/helpers.js";
import { filterBlockedSquares, adjacent, sameColumn, sameNegativeDiagonal, samePositiveDiagonal, sameRow, sameUnitDiagonals } from "../attackVectors.js";
import { Position } from "../models.js";

const tg = createTestGroup('Attack Vectors Testing', ()=> {});

tg.add('sameColumn', () => {
    const state = emptyState();
    const colPos = sameColumn([4, 5], state).map(s => s.position);

    if(colPos.length !== 8) {
        return false;
    }

    const passed = posEquals(colPos[0], [0,5]) && posEquals(colPos[1], [1,5]) &&
                   posEquals(colPos[2], [2,5]) && posEquals(colPos[3], [3,5]) &&
                   posEquals(colPos[4], [4,5]) && posEquals(colPos[5], [5,5]) &&
                   posEquals(colPos[6], [6,5]) && posEquals(colPos[7], [7,5])

    return passed;
});

tg.add('samePositiveDiagonal', () => {
    const state = emptyState();

    const pos = samePositiveDiagonal([1, 2], state).map(s => s.position);
    if(pos.length !== 4) {
        return false;
    }
    const passed = posEquals(pos[0], [0,3]) && posEquals(pos[1], [1,2]) &&
                   posEquals(pos[2], [2,1]) && posEquals(pos[3], [3,0])

    return passed;
});

tg.add('samePositiveDiagonal2', () => {
    const state = emptyState();

    const pos = samePositiveDiagonal([7, 6], state).map(s => s.position);
    if(pos.length !== 2) {
        return false;
    }
    const passed = posEquals(pos[0], [6, 7]) && posEquals(pos[1], [7, 6]);

    return passed;
});

tg.add('sameNegativeDiagonal', () => {
    const state = emptyState();
    const pos = sameNegativeDiagonal([1, 2], state).map(s => s.position);
    return arrayEquals(pos, [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
    ], positionComparator())
});

tg.add('sameNegativeDiagonal2', () => {
    const state = emptyState();
    const pos = sameNegativeDiagonal([7, 1], state).map(s => s.position);
    return arrayEquals(pos, [
        [6, 0],
        [7, 1],
    ], positionComparator())
});

tg.add('sameRow', () => {
    const state = emptyState();
    const pos = sameRow([7, 1], state).map(s => s.position);
    return arrayEquals(pos, [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6],
        [7, 7],
    ], positionComparator())
});

tg.add('sameUnitDiagonals1', () => {
    const state = emptyState();
    const pos = sameUnitDiagonals([7, 1], state, 'north').map(s => s.position);
    return arrayEquals(pos, [
        [6, 0],
        [6, 2],
    ], positionComparator())
});

tg.add('sameUnitDiagonals2', () => {
    const state = emptyState();
    const pos = sameUnitDiagonals([7, 1], state, 'south').map(s => s.position);
    return pos.length === 0;
});

tg.add('sameUnitDiagonals4', () => {
    const state = emptyState();
    const pos = sameUnitDiagonals([0, 7], state, 'south').map(s => s.position);
    return arrayEquals(pos, [
        [1, 6],
    ], positionComparator())
});

tg.add('sameUnitDiagonals5', () => {
    const state = emptyState();
    const pos = sameUnitDiagonals([3, 4], state, 'south').map(s => s.position);
    return arrayEquals(pos, [
        [4, 3],
        [4, 5],
    ], positionComparator())
});

tg.add('filterBlockedSquares', () => {
    const state = emptyState();
    const attackingPiecePos: Position = [7, 1];
    setPiece(state, attackingPiecePos, {name: 'rook', color: 'white'});
    setPiece(state, [7,6], {name: 'rook', color: 'white'});
    const attacking = filterBlockedSquares(attackingPiecePos, sameRow(attackingPiecePos, state)).map(s => s.position);
    return arrayEquals(attacking, [
        [7, 0],
        [7, 1],
        [7, 2],
        [7, 3],
        [7, 4],
        [7, 5],
        [7, 6],
    ], positionComparator())
});

tg.add('filterBlockedSquares2', () => {
    const state = emptyState();
    const attackingPiecePos: Position = [5, 2];
    setPiece(state, attackingPiecePos, {name: 'rook', color: 'white'});

    setPiece(state, [3, 0], {name: 'bishop', color: 'black'});
    setPiece(state, [4, 1], {name: 'bishop', color: 'black'});
    setPiece(state, [6, 3], {name: 'bishop', color: 'black'});
    const attacking = filterBlockedSquares(attackingPiecePos, sameNegativeDiagonal(attackingPiecePos, state)).map(s => s.position);
    return arrayEquals(attacking, [
        [4, 1],
        [5, 2],
        [6, 3]
    ], positionComparator());
});

tg.add('filterBlockedSquares3', () => {
    const state = emptyState();
    const attackingPiecePos: Position = [1, 2];
    setPiece(state, attackingPiecePos, {name: 'rook', color: 'white'});
    const attacking = filterBlockedSquares(attackingPiecePos, sameNegativeDiagonal(attackingPiecePos, state)).map(s => s.position);
    return arrayEquals(attacking, [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 7],
    ], positionComparator());
});

tg.add('filterBlockedSquares4', () => {
    const state = emptyState();
    const attackingPiecePos: Position = [4, 3];
    setPiece(state, attackingPiecePos, {name: 'bishop', color: 'black'});
    setPiece(state, [4, 0], {name: 'bishop', color: 'black'});
    setPiece(state, [4, 2], {name: 'bishop', color: 'black'});
    setPiece(state, [4, 5], {name: 'bishop', color: 'black'});
    setPiece(state, [4, 7], {name: 'bishop', color: 'black'});
    const attacking = filterBlockedSquares(attackingPiecePos, sameRow(attackingPiecePos, state)).map(s => s.position);
    return arrayEquals(attacking, [
        [4, 2],
        [4, 3],
        [4, 4],
        [4, 5],
    ], positionComparator());
});

tg.add('adjacent1', () => {
    let behind = adjacent([5, 5], 'north');
    if(!behind || !posEquals(behind, [4, 5])) {
        return false;
    }

    behind = adjacent([5, 5], 'south');
    if(!behind || !posEquals(behind, [6, 5])) {
        return false;
    }

    behind = adjacent([0, 0], 'north');
    if(behind) {
        return false;
    }

    return true;
});

tg.execute();