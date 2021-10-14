import { createTestGroup } from "../../../testing/test-execution.js";
import { ChessState } from "../models.js";
import { countPieces, inCheckMate, inStaleMate } from "../stateQueries.js";

const tg = createTestGroup('State Queries Testing');

tg.add('checkmate 1', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"touched":true},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"piece":{"color":"black","name":"pawn"}},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3],"touched":true,"piece":{"color":"white","name":"knight"}},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,3]},{"position":[3,4]},{"position":[3,5],"touched":true},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2],"touched":true},{"position":[4,3],"touched":true},{"position":[4,4],"piece":{"color":"white","name":"queen"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,5],"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    return inCheckMate({"startPos":[4,2],"endPos":[2,3]}, state, 'black');
});

tg.add('checkmate 2', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"touched":true},{"position":[0,2],"touched":true},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"piece":{"color":"black","name":"pawn"}},{"position":[1,3],"touched":true},{"position":[1,4],"piece":{"color":"black","name":"pawn"}},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"touched":true},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2],"touched":true},{"position":[2,3]},{"position":[2,4]},{"position":[2,5],"piece":{"color":"black","name":"knight"},"touched":true},{"position":[2,6],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2]},{"position":[3,3],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,4]},{"position":[3,5]},{"position":[3,6],"touched":true},{"position":[3,7],"piece":{"color":"white","name":"king"},"touched":true}],[{"position":[4,0]},{"position":[4,1],"touched":true},{"position":[4,2]},{"position":[4,3]},{"position":[4,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"piece":{"color":"black","name":"bishop"},"touched":true},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3],"touched":true},{"position":[5,4],"touched":true},{"position":[5,5],"piece":{"color":"black","name":"knight"},"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"piece":{"color":"white","name":"queen"}},{"position":[7,4],"touched":true},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"piece":{"color":"white","name":"knight"}},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    return inCheckMate({"startPos":[7,4],"endPos":[5,5]}, state, 'white');
});

tg.add('not stalemate', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"touched":true},{"position":[0,1],"touched":true},{"position":[0,2],"touched":true},{"position":[0,3],"touched":true},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"touched":true}],[{"position":[1,0],"touched":true},{"position":[1,1],"touched":true},{"position":[1,2],"touched":true},{"position":[1,3],"touched":true},{"position":[1,4],"piece":{"color":"black","name":"pawn"}},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"touched":true}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,3]},{"position":[2,4],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,5],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,6],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,7],"touched":true}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2],"touched":true},{"position":[3,3]},{"position":[3,4],"touched":true},{"position":[3,5],"touched":true},{"position":[3,6],"touched":true},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2],"touched":true},{"position":[4,3],"touched":true,"piece":{"color":"white","name":"queen"}},{"position":[4,4],"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"touched":true},{"position":[4,7],"touched":true}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2],"touched":true},{"position":[5,3],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,4]},{"position":[5,5],"touched":true},{"position":[5,6],"touched":true},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"touched":true},{"position":[6,3],"touched":true},{"position":[6,4],"touched":true},{"position":[6,5],"touched":true},{"position":[6,6],"touched":true},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"piece":{"color":"white","name":"knight"}},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    return !inStaleMate({"startPos":[4,7],"endPos":[4,3]}, state, 'black');
});

tg.add('stalemate 1', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"touched":true},{"position":[0,1],"touched":true},{"position":[0,2],"touched":true},{"position":[0,3],"touched":true},{"position":[0,4],"touched":true,"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"touched":true},{"position":[0,7],"touched":true}],[{"position":[1,0],"touched":true},{"position":[1,1],"touched":true},{"position":[1,2],"touched":true},{"position":[1,3],"touched":true},{"position":[1,4],"piece":{"color":"black","name":"pawn"}},{"position":[1,5],"touched":true},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"touched":true}],[{"position":[2,0]},{"position":[2,1],"touched":true},{"position":[2,2],"touched":true},{"position":[2,3]},{"position":[2,4],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,5],"touched":true,"piece":{"color":"black","name":"pawn"}},{"position":[2,6],"touched":true,"piece":{"color":"white","name":"pawn"}},{"position":[2,7],"touched":true}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2],"touched":true},{"position":[3,3],"piece":{"color":"white","name":"queen"},"touched":true},{"position":[3,4],"touched":true},{"position":[3,5],"touched":true,"piece":{"color":"white","name":"bishop"}},{"position":[3,6],"touched":true},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1],"touched":true},{"position":[4,2],"touched":true},{"position":[4,3],"touched":true},{"position":[4,4],"touched":true},{"position":[4,5],"touched":true},{"position":[4,6],"touched":true},{"position":[4,7],"touched":true}],[{"position":[5,0],"touched":true},{"position":[5,1]},{"position":[5,2],"touched":true},{"position":[5,3],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,4]},{"position":[5,5],"touched":true},{"position":[5,6],"touched":true},{"position":[5,7],"touched":true}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"touched":true},{"position":[6,3],"touched":true},{"position":[6,4],"touched":true},{"position":[6,5],"touched":true},{"position":[6,6],"touched":true},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"touched":true},{"position":[7,6],"piece":{"color":"white","name":"knight"}},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    return inStaleMate({"startPos":[5,5],"endPos":[3,3]}, state, 'black');
});

tg.add('piece count', () => {
    const state: ChessState = {"board":[[{"position":[0,0],"piece":{"color":"black","name":"rook"}},{"position":[0,1],"piece":{"color":"black","name":"knight"}},{"position":[0,2],"piece":{"color":"black","name":"bishop"}},{"position":[0,3],"piece":{"color":"black","name":"queen"}},{"position":[0,4],"piece":{"color":"black","name":"king"}},{"position":[0,5],"piece":{"color":"black","name":"bishop"}},{"position":[0,6],"piece":{"color":"black","name":"knight"}},{"position":[0,7],"piece":{"color":"black","name":"rook"}}],[{"position":[1,0],"piece":{"color":"black","name":"pawn"}},{"position":[1,1],"piece":{"color":"black","name":"pawn"}},{"position":[1,2],"touched":true},{"position":[1,3],"piece":{"color":"black","name":"pawn"}},{"position":[1,4],"piece":{"color":"black","name":"pawn"}},{"position":[1,5],"piece":{"color":"black","name":"pawn"}},{"position":[1,6],"piece":{"color":"black","name":"pawn"}},{"position":[1,7],"piece":{"color":"black","name":"pawn"}}],[{"position":[2,0]},{"position":[2,1]},{"position":[2,2]},{"position":[2,3],"touched":true,"piece":{"color":"white","name":"knight"}},{"position":[2,4]},{"position":[2,5]},{"position":[2,6]},{"position":[2,7]}],[{"position":[3,0]},{"position":[3,1]},{"position":[3,2],"piece":{"color":"black","name":"pawn"},"touched":true},{"position":[3,3]},{"position":[3,4]},{"position":[3,5],"touched":true},{"position":[3,6]},{"position":[3,7]}],[{"position":[4,0]},{"position":[4,1]},{"position":[4,2],"touched":true},{"position":[4,3],"touched":true},{"position":[4,4],"piece":{"color":"white","name":"queen"},"touched":true},{"position":[4,5]},{"position":[4,6]},{"position":[4,7]}],[{"position":[5,0]},{"position":[5,1]},{"position":[5,2]},{"position":[5,3]},{"position":[5,4],"piece":{"color":"white","name":"pawn"},"touched":true},{"position":[5,5],"touched":true},{"position":[5,6]},{"position":[5,7]}],[{"position":[6,0],"piece":{"color":"white","name":"pawn"}},{"position":[6,1],"piece":{"color":"white","name":"pawn"}},{"position":[6,2],"piece":{"color":"white","name":"pawn"}},{"position":[6,3],"piece":{"color":"white","name":"pawn"}},{"position":[6,4],"touched":true},{"position":[6,5],"piece":{"color":"white","name":"pawn"}},{"position":[6,6],"piece":{"color":"white","name":"pawn"}},{"position":[6,7],"piece":{"color":"white","name":"pawn"}}],[{"position":[7,0],"piece":{"color":"white","name":"rook"}},{"position":[7,1],"piece":{"color":"white","name":"knight"}},{"position":[7,2],"piece":{"color":"white","name":"bishop"}},{"position":[7,3],"touched":true},{"position":[7,4],"piece":{"color":"white","name":"king"}},{"position":[7,5],"piece":{"color":"white","name":"bishop"}},{"position":[7,6],"touched":true},{"position":[7,7],"piece":{"color":"white","name":"rook"}}]]};
    return countPieces(state) === 32;
});

tg.execute();