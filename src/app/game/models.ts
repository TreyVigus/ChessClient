//TODO: can significantly reduce memory / moderately increase perf by changing the strings to single characters
//		may be faster to use integer instead of string

export type Position = [number, number];

export type Color = 'black' | 'white';

export type Piece = {
	color: Color,
	name: 1 | 2 | 'bishop' | 'knight' | 'pawn' | 'rook'
};

export type Square = {
	position: Position,
	piece?: Piece,
	touched?: boolean, //true if a move has been made to or from the square.
};

export type ChessState = {
	board: Square[][],
};