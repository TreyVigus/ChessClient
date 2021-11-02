import { createTestGroup } from "../../../testing/test-execution.js";
import { ChessState } from "../../game/models.js";
import { countPieces } from "../countPieces.js";

const tg = createTestGroup('Count Pieces Testing', ()=> {});

const state: ChessState = {"board":[[{"position":[0,0],"touched":true},{"position":[0,1],"touched":true},{"position":[0,2],"touched":true},{"position":[0,3],"touched":true,"piece":{"color":"black","name":1}},{"position":[0,4],"touched":true},{"position":[0,5],"touched":true,"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"touched":true},{"position":[1,2],"touched":true},{"position":[1,3],"touched":true},{"position":[1,4],"touched":true},{"position":[1,5],"touched":true},{"position":[1,6],"touched":true},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0],"piece":{"color":"white","name":2},"touched":true},{"position":[2,1]},{"position":[2,2],"touched":true,"piece":{"color":"white","name":"bishop"}},{"position":[2,3]},{"position":[2,4],"touched":true},{"position":[2,5],"touched":true},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,2],"touched":true},{"position":[3,3],"touched":true},{"position":[3,4],"touched":true,"piece":{"color":"white","name":"knight"}},{"position":[3,5],"touched":true},{"position":[3,6],"touched":true},{"position":[3,7],"touched":true}],[{"position":[4,0],"piece":{"color":"white","name":"knight"},"touched":true},{"position":[4,1]},{"position":[4,2],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[4,3],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[4,4],"piece":{"color":"black","name":"knight"},"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"touched":true,"piece":{"color":"black","name":"pawn"}},{"position":[4,7]}],[{"position":[5,0],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,1],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,2],"touched":true},{"position":[5,3],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,4],"touched":true},{"position":[5,5],"touched":true},{"position":[5,6],"touched":true},{"position":[5,7]}],[{"position":[6,0],"touched":true},{"position":[6,1],"touched":true},{"position":[6,2],"touched":true},{"position":[6,3],"touched":true},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"touched":true},{"position":[7,1],"touched":true},{"position":[7,2],"touched":true,"piece":{"color":"white","name":"rook"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":1}},{"position":[7,5],"touched":true},{"position":[7,6],"touched":true,"piece":{"color":"white","name":"rook"}},{"position":[7,7],"touched":true}]]};

tg.add('black rooks', () => {
    const count = countPieces(state, (p) => {
        return p.name === 'rook' && p.color === 'black';
    });
    return count === 1;
});

tg.add('any rooks', () => {
    const count = countPieces(state, (p) => {
        return p.name === 'rook';
    });
    return count === 3;
});

tg.add('any black piece', () => {
    const count = countPieces(state, (p) => {
        return p.color === 'black';
    });
    return count === 10;
});

tg.add('any piece', () => {
    const count = countPieces(state);
    return count === 23;
});

tg.execute();