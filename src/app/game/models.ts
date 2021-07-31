export type Position = [number, number];

export type Color = 'black' | 'white';

export type Piece = {
	color: Color,
	name: 'king' | 'queen' | 'bishop' | 'knight' | 'pawn' | 'rook'
};

export type Square = {
	position: Position,
	piece?: Piece,
	touched?: boolean, //true if a move has been made to or from the square.
};

export type ChessState = {
	board: Square[][],
};