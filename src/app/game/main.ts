import { simpleMindedBot } from "../ai/bot.js";
import { minimaxbot } from "../ai/minimaxBot.js";
import { flat, posSequence } from "../utils/helpers.js";
import { BoardView, initBoardView, MoveEvent } from "../view/boardView.js";
import { displayVictor } from "../view/infoView.js";
import { gameLoop, GameSubscriptions, Player, Ply, Winner } from "./gameLoop.js";
import { ChessState } from "./models.js";
import { findKing, inCheck } from "./stateQueries.js";

/********* Debugging flags **********/
const showSquarePositions = false; //render simple board with position info
const useBots = false; //have bots play each other
/***********************************/

const view = initBoardView();

if(showSquarePositions) {
    view.showSquarePositions();
} else {
    const white: Player = useBots ? simpleMindedBot('white') : { move: getPlayerMove };
    const black = minimaxbot('black');
    const subs: GameSubscriptions = {
        onInitialState: (initial: ChessState) => {
            drawState(initial, view);
        },
        onLegalPly: (ply: Ply) => {
            drawState(ply.state, view);
        },
        onGameEnd: (finalPly: Ply, winner: Winner) => {
            displayVictor(winner);
        }
    }

    gameLoop(white, black, subs);
}

async function getPlayerMove(): Promise<MoveEvent> {
    const playerMove = new Promise<MoveEvent>((resolve) => {
        //TODO: memory leak
        view.moveEmitter.subscribe((attemptedMove: MoveEvent) => {
            resolve(attemptedMove);
        });
    });

    return playerMove;
}

function drawState(state: ChessState, view: BoardView) {
    for(const s of flat(state.board)) {
        view.removePiece(s.value.position);
        if(s.value.piece) {
            view.drawPiece(s.value.piece, s.index);
        }
    }
    highlightInCheck(state, view);
}

function highlightInCheck(state: ChessState, view: BoardView) {
    //clear out any previous highlighting
    posSequence().forEach(pos => {
        view.removeHighlight(pos);
    });

    const whiteKing = findKing(state, 'white').position;
    if(inCheck(state, 'white')) {
        view.addHighlight(whiteKing);
    }

    const blackKing = findKing(state, 'black').position;
    if(inCheck(state, 'black')) {
        view.addHighlight(blackKing);
    }
}