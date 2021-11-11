import { simpleMindedBot } from "../ai/bot.js";
import { minimaxbot } from "../ai/minimaxBot.js";
import { smartMinimax } from "../ai/smarterMinimax.js";
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
    const white: Player = useBots ? simpleMindedBot(2) : { move: getPlayerMove };
    const black = minimaxbot(1);
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

    const whiteKing = findKing(state, 2).position;
    if(inCheck(state, 2)) {
        view.addHighlight(whiteKing);
    }

    const blackKing = findKing(state, 1).position;
    if(inCheck(state, 1)) {
        view.addHighlight(blackKing);
    }
}