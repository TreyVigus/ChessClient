import { Color, Piece, Position } from "../game/models.js";
import { createEmitter, Emitter } from "../utils/emitter.js";
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
	/** Remove the piece from the given position if one exists. */
	removePiece(pos: Position): void,
	/** Print the indices on each square. Useful for debugging. */
	showSquarePositions(): void,
	/** Hide the indices created from showSquarePositions() */
	hideSquarePositions(): void
}

export function initView(): BoardView {
	const board: HTMLDivElement[][] = getBoard();

	const drawPiece = (piece: Piece, pos: Position): void => {
		const img = document.createElement('img');
		img.setAttribute('src', `view/img/${piece.color}/${piece.name}.svg`);
		img.setAttribute('height', '60');
		img.setAttribute('width', '60');
		board[pos[0]][pos[1]].appendChild(img);
	}

	const removePiece = (pos: Position): void => {
		const tile = board[pos[0]][pos[1]];
		const img = tile.querySelector('img');
		if(img) {
			tile.removeChild(img);
		}
	}

	const showSquarePositions = () => {
		for(let i = 0; i < BOARD_SIZE; i++) {
			for(let j = 0; j < BOARD_SIZE; j++) {
				const tile = board[i][j];
				tile.textContent = `(${i}, ${j})`;
			}
		}
	}

	const hideSquarePositions = () => {
		for(let i = 0; i < BOARD_SIZE; i++) {
			for(let j = 0; j < BOARD_SIZE; j++) {
				const tile = board[i][j];
				tile.textContent = null;
			}
		}
	}

	const moveEmitter = createEmitter<MoveEvent>();
	emitDragDrop(moveEmitter, board);

	return {moveEmitter, drawPiece, removePiece, showSquarePositions, hideSquarePositions};
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
	tile.setAttribute('draggable', 'true');
	return tile;
}

function emitDragDrop(moveEmitter: Emitter<MoveEvent>, board: HTMLDivElement[][]) {
	for(let i = 0; i < board.length; i++) {
		for(let j = 0; j < board.length; j++) {
			const tile = board[i][j];

			tile.addEventListener('dragstart', (e)=> {
				e.dataTransfer!.setData('text/plain', serializePos([i, j]));
			});

			//Not sure why the dragover is needed. Without it drop won't fire.
			tile.addEventListener('dragover', (e)=> {
				e.preventDefault();
			});

			tile.addEventListener('drop', (e)=> {
				e.preventDefault();
				const stringPos = e.dataTransfer!.getData('text/plain');
				const startPos = deserializePos(stringPos);
				const endPos: Position = [i, j];
				moveEmitter.publish({startPos, endPos});
			});
		}
	}
}

function serializePos(position: Position): string {
	return `${position[0]}-${position[1]}`;
}

function deserializePos(stringPos: string): Position {
	const parts = stringPos.split('-').map(p => parseInt(p, 10));
	return [parts[0], parts[1]];
}