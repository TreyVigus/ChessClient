//TODO: can significantly reduce memory / moderately increase perf by changing the strings to single characters
//		may be faster to use integer instead of string

export type Position = [number, number];

export type Color = 'black' | 'white';

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