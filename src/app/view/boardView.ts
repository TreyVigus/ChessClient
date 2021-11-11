import { Color, Piece, Position } from "../game/models.js";
import { createEmitter, Emitter } from "../utils/emitter.js";
import { constructBoard, flat, itemAt, posColor, posSequence } from "../utils/helpers.js";

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
	hideSquarePositions(): void,
	/** Highlight the square at the given position. */
	addHighlight(pos: Position): void,
	/** Remove highlighting from the square at the given position. */
	removeHighlight(pos: Position): void
}

export function initBoardView(): BoardView {
	const board: HTMLDivElement[][] = getBoard();

	const drawPiece = (piece: Piece, pos: Position): void => {
		const img = document.createElement('img');
		img.setAttribute('src', `view/img/${piece.color}/${piece.name}.svg`);
		img.setAttribute('height', '60');
		img.setAttribute('width', '60');
		itemAt(board, pos).appendChild(img);
	}

	const removePiece = (pos: Position): void => {
		const tile = itemAt(board, pos);
		const img = tile.querySelector('img');
		if(img) {
			tile.removeChild(img);
		}
	}

	const showSquarePositions = () => {
		for(const tile of flat(board)) {
			const [i, j] = tile.index;
			tile.value.textContent = `(${i}, ${j})`;
		}
	}

	const hideSquarePositions = () => {
		for(const tile of flat(board)) {
			tile.value.textContent = null;
		}
	}

	const highlightClass = 'highlight';
	const addHighlight = (pos: Position) => {
		itemAt(board, pos).classList.add(highlightClass);
	};

	const removeHighlight = (pos: Position) => {
		itemAt(board, pos).classList.remove(highlightClass);
	};

	const moveEmitter = createEmitter<MoveEvent>();
	emitDragDrop(moveEmitter, board);

	return {moveEmitter, drawPiece, removePiece, showSquarePositions, hideSquarePositions, addHighlight, removeHighlight};
}

/** Create the board in the DOM and return 2d array of each square. **/
function getBoard(): HTMLDivElement[][] {
	const boardContainer: HTMLDivElement = document.querySelector('.board')!;
	const board: HTMLDivElement[][] = constructBoard((pos: Position) => getTile(posColor(pos)));
	for(const t of flat(board)) {
		boardContainer.appendChild(t.value);
	}
	return board;
}

function getTile(color: Color): HTMLDivElement {
	const tile = document.createElement('div');
	tile.classList.add('tile');
	if(color === 1) {
		tile.classList.add('dark');
	} else {
		tile.classList.add('light');
	}
	tile.setAttribute('draggable', 'true');
	return tile;
}

function emitDragDrop(moveEmitter: Emitter<MoveEvent>, board: HTMLDivElement[][]) {
	for(const t of flat(board)) {
		t.value.addEventListener('dragstart', (e)=> {
			e.dataTransfer!.setData('text/plain', serializePos(t.index));
		});

		//Not sure why the dragover is needed. Without it drop won't fire.
		t.value.addEventListener('dragover', (e)=> {
			e.preventDefault();
		});

		t.value.addEventListener('drop', (e)=> {
			e.preventDefault();
			const stringPos = e.dataTransfer!.getData('text/plain');
			const startPos = deserializePos(stringPos);
			moveEmitter.publish({startPos: startPos, endPos: t.index});
		});
	}
}

function serializePos(position: Position): string {
	return `${position[0]}-${position[1]}`;
}

function deserializePos(stringPos: string): Position {
	const parts = stringPos.split('-').map(p => parseInt(p, 10));
	return [parts[0], parts[1]];
}