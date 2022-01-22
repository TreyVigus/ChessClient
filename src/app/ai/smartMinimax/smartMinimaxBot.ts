import { Player } from "../../game/gameLoop.js";
import { ChessState, Color } from "../../game/models.js";
import { MoveEvent } from "../../view/boardView.js";

export function smartMinimax(color: Color): Player {
    return {
        move: (prevPly: MoveEvent | undefined, state: ChessState) => {
            return new Promise<MoveEvent>((resolve) => {
                const worker = new Worker('/ai/smartMinimax/smartMinimaxWorker.js', {type: "module"});
                worker.postMessage([prevPly, state, color]);
                worker.onmessage = (message: any) => {
                    resolve(message.data);
                };
            });
        }
    }
}