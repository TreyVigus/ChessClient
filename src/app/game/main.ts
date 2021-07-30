//Handles chess logic (may be broken into sub components however)
//Needs to handle turn-based logic as well (create another file with logic/interface for this)

//Subscribe to MoveEvents from the boardView. The boardView will not check if moves are legal, so this needs to have logic to do so.
//  - Find the Squares corresponding to the startPos and endPos from the MoveEvent
//  - startPos should have a piece on it. endPos may not.
//  - check if the piece on startPos can legally move to endPos (movements.ts will have useful functions for this.)
//      - if legal, make the move
//      - if not, ignore the move

import { initView } from "../view/boardView.js";

const view = initView();