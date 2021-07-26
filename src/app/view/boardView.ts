//Functions in this file should have no concept of the rules of chess and simply handle 'drag and drop'/ board drawing.

import { Color, Piece, Position } from "../game/models.js";
import { Emitter } from "../utils/emitter.js";
import { posColor } from "../utils/helpers.js";

export const BOARD_SIZE = 8;

export type MoveEvent = {
	startPos: Position,
	endPos: Position
}

export type BoardView = {
	/** Emit moves as the player makes them. */
	moveEmitter: Emitter<MoveEvent>, 
	/** Draw the given piece at the given position. */
	drawPiece(piece: Piece, pos: Position): void,
	/** Remove the image from the given position if one exists. */
	removeImage(pos: Position): void,
	/** Print the indices on each square. Useful for debugging. */
	showSquarePositions(): void,
	/** Hide the indices created from showSquarePositions() */
	hideSquarePositions(): void
}

/**
 * Render the board without pieces (pieces drawn by consumer via BoardView.drawImage().
 * - Make a div with class="board"
 * Set up drag and drop listeners
 * - Listeners should emit MoveEvent.
 */
export function initView(): void { //TODO: change to return BoardView
	const board: HTMLDivElement[][] = getBoard();

	const drawPiece = (piece: Piece, pos: Position): void => {
		const img = document.createElement('img');
		img.setAttribute('src', `view/img/${piece.color}/${piece.name}.svg`);
		img.setAttribute('height', '60');
		img.setAttribute('width', '60');
		board[pos[0]][pos[1]].appendChild(img);
	}

	drawPiece({name:'rook', color: 'black'}, [3,4]);
}

/** Create the board in the DOM and return 2d array of each square. **/
function getBoard(): HTMLDivElement[][] {
	const boardContainer: HTMLDivElement = document.querySelector('.board')!;
	const tiles: HTMLDivElement[][] = [];
	
	for(let i = 0; i < BOARD_SIZE; i++) {
		let row: HTMLDivElement[] = [];
		for(let j = 0; j < BOARD_SIZE; j++) {
			const color = posColor([i, j]);
			const tile = getTile(color);
			boardContainer.appendChild(tile);
			row.push(tile);
		}
		tiles.push(row);
	}

	return tiles;
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