export type Position = [number, number];

/** black, white */
export type Color = 1 | 2;

export type Piece = {
	color: Color,
	/**
	 * king, queen, bishop, knight, pawn, rook
	 */
	name: 1 | 2 | 3 | 4 | 5 | 6
};

export type Square = {
	position: Position,
	piece?: Piece,
	touched?: boolean, //true if a move has been made to or from the square.
};

export type ChessState = {
	board: Square[][],
};