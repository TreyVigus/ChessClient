export type Position = [number, number];

export type Color = 'white' | 'black';

export type Piece = {
	name: 'king' | 'queen' | 'bishop' | 'knight' | 'pawn' | 'rook',
	color: Color
};

export type Square = {
	position: Position,
	piece?: Piece
};

export type Move = {
	piece: Piece,
	prevSquare: Square,
	nextSquare: Square
};

export type ChessState = {
	board: Square[],
	lastMove?: Move
};