//Functions in this file should have no concept of the rules of chess and simply handle 'drag and drop'/ board drawing.

import { Position } from "../models.js";

export type MoveEvent = {
	startSquare: Position,
	endSquare: Position
}

export type BoardView = {
	// onMove(): Emitter<MoveEvent> //object that emits move events

	/**
 	* Draw the given image at the given position.
 	* - Could make a type containing all possible piece images instead of imgPath.
 	* - Controller will likely interpret MoveEvents as chess moves and then invoke this and removeImage().
 	*/
	drawImage(imgPath: string, pos: Position): void,
	removeImage(pos: Position): void;
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
