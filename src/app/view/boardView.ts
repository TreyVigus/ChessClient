//Functions in this file should have no concept of the rules of chess and simply handle 'drag and drop'/ board drawing.

import { Position } from "../game/models.js";
import { Emitter } from "../utils/emitter.js";

export type MoveEvent = {
	startPos: Position,
	endPos: Position
}

export type BoardView = {
	/**
	 * Object that emits move events
	 */
	emitter: Emitter<MoveEvent>, 
	/**
 	* Draw the given image at the given position.
 	* - Could make a type containing all possible piece images instead of imgPath.
 	* - Controller will likely interpret MoveEvents as chess moves and then invoke this and removeImage().
 	*/
	drawImage(imgPath: string, pos: Position): void,
	removeImage(pos: Position): void,
	/**
	 * Print the indices on each square. Useful for debugging.
	 */
	showSquarePositions(): void
}

/**
 * Render the board without pieces (pieces drawn by consumer via BoardView.drawImage().
 * - Make a div with class="board"
 * Set up drag and drop listeners
 * - Listeners should emit MoveEvent.
 */
export function initView(): BoardView {
	throw 'unfinished';
}