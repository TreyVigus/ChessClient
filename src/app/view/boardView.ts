//Functions in this file should have no concept of the rules of chess and simply handle 'drag and drop'/ board drawing.

import { Color, Position } from "../game/models.js";
import { Emitter } from "../utils/emitter.js";
import { oppositeColor } from "../utils/helpers.js";

export const BoardSize = 8;

export type MoveEvent = {
	startPos: Position,
	endPos: Position
}

export type BoardView = {
	/**
	 * Object that emits move events
	 */
	moveEmitter: Emitter<MoveEvent>, 
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
export function initView(): void { //TODO: change to return BoardView
	drawBoard();
}

function drawBoard(): void {
	const board: HTMLDivElement = document.querySelector('.board')!;
	for(let i = 0; i < BoardSize; i++) {
		let color: Color = (i % 2) === 0 ? 'black': 'white';
		for(let j = 0; j < BoardSize; j++) {
			color = oppositeColor(color);
			board.appendChild(getTile(color));
		}
	}
}

function getTile(color: Color): HTMLDivElement {
	const tile = document.createElement('div');
	tile.classList.add('tile');
	if(color === 'black') {
		tile.classList.add('dark');
	} else {
		tile.classList.add('light');
	}
	return tile;
}