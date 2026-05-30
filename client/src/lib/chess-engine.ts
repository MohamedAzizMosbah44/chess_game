export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
  symbol: string;
  hasMoved?: boolean;
}

export class ChessEngine {
  private board: (Piece | null)[][] = [];
  public currentPlayer: PieceColor = "white";
  private gameMode: "pvp" | "pvc";
  private difficulty: "easy" | "medium" | "hard";
  private moveHistory: Array<{ from: [number, number]; to: [number, number]; captured?: Piece }> = [];

  constructor(gameMode: "pvp" | "pvc", difficulty: "easy" | "medium" | "hard" = "medium") {
    this.gameMode = gameMode;
    this.difficulty = difficulty;
    this.initializeBoard();
  }

  private initializeBoard() {
    this.board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    // Place pawns
    for (let col = 0; col < 8; col++) {
      this.board[1][col] = { type: "pawn", color: "black", symbol: "♟", hasMoved: false };
      this.board[6][col] = { type: "pawn", color: "white", symbol: "♙", hasMoved: false };
    }

    // Place other pieces
    const backRowTypes: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    const backRowSymbols = ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"];
    const blackSymbols = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];

    for (let col = 0; col < 8; col++) {
      this.board[0][col] = { type: backRowTypes[col], color: "black", symbol: blackSymbols[col], hasMoved: false };
      this.board[7][col] = { type: backRowTypes[col], color: "white", symbol: backRowSymbols[col], hasMoved: false };
    }
  }

  getPieceAt(pos: [number, number]): Piece | null {
    const [row, col] = pos;
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this.board[row][col];
  }

  private setPieceAt(pos: [number, number], piece: Piece | null) {
    const [row, col] = pos;
    if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
      this.board[row][col] = piece;
    }
  }

  getValidMoves(pos: [number, number]): [number, number][] {
    const piece = this.getPieceAt(pos);
    if (!piece || piece.color !== this.currentPlayer) return [];

    let moves: [number, number][] = [];

    switch (piece.type) {
      case "pawn":
        moves = this.getPawnMoves(pos);
        break;
      case "rook":
        moves = this.getRookMoves(pos);
        break;
      case "knight":
        moves = this.getKnightMoves(pos);
        break;
      case "bishop":
        moves = this.getBishopMoves(pos);
        break;
      case "queen":
        moves = this.getQueenMoves(pos);
        break;
      case "king":
        moves = this.getKingMoves(pos);
        break;
    }

    // Filter out moves that would leave the king in check
    return moves.filter(move => {
      const testBoard = this.simulateMove(pos, move);
      return !this.isKingInCheck(piece.color, testBoard);
    });
  }

  private getPawnMoves(pos: [number, number]): [number, number][] {
    const [row, col] = pos;
    const piece = this.getPieceAt(pos)!;
    const moves: [number, number][] = [];
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    // Forward move
    const nextRow = row + direction;
    if (nextRow >= 0 && nextRow <= 7 && !this.getPieceAt([nextRow, col])) {
      moves.push([nextRow, col]);

      // Double move from start
      if (row === startRow && !this.getPieceAt([row + 2 * direction, col])) {
        moves.push([row + 2 * direction, col]);
      }
    }

    // Captures
    for (const dcol of [-1, 1]) {
      const captureCol = col + dcol;
      if (captureCol >= 0 && captureCol <= 7) {
        const captureSquare = [nextRow, captureCol] as [number, number];
        const target = this.getPieceAt(captureSquare);
        if (target && target.color !== piece.color) {
          moves.push(captureSquare);
        }
      }
    }

    return moves;
  }

  private getRookMoves(pos: [number, number]): [number, number][] {
    const moves: [number, number][] = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = pos[0] + dr * i;
        const newCol = pos[1] + dc * i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;

        const target = this.getPieceAt([newRow, newCol]);
        if (!target) {
          moves.push([newRow, newCol]);
        } else {
          if (target.color !== this.getPieceAt(pos)!.color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    }

    return moves;
  }

  private getKnightMoves(pos: [number, number]): [number, number][] {
    const moves: [number, number][] = [];
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];

    for (const [dr, dc] of offsets) {
      const newRow = pos[0] + dr;
      const newCol = pos[1] + dc;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        const target = this.getPieceAt([newRow, newCol]);
        if (!target || target.color !== this.getPieceAt(pos)!.color) {
          moves.push([newRow, newCol]);
        }
      }
    }

    return moves;
  }

  private getBishopMoves(pos: [number, number]): [number, number][] {
    const moves: [number, number][] = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = pos[0] + dr * i;
        const newCol = pos[1] + dc * i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;

        const target = this.getPieceAt([newRow, newCol]);
        if (!target) {
          moves.push([newRow, newCol]);
        } else {
          if (target.color !== this.getPieceAt(pos)!.color) {
            moves.push([newRow, newCol]);
          }
          break;
        }
      }
    }

    return moves;
  }

  private getQueenMoves(pos: [number, number]): [number, number][] {
    return [...this.getRookMoves(pos), ...this.getBishopMoves(pos)];
  }

  private getKingMoves(pos: [number, number]): [number, number][] {
    const moves: [number, number][] = [];
    const piece = this.getPieceAt(pos)!;
    
    // Regular king moves
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = pos[0] + dr;
        const newCol = pos[1] + dc;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          const target = this.getPieceAt([newRow, newCol]);
          if (!target || target.color !== piece.color) {
            moves.push([newRow, newCol]);
          }
        }
      }
    }

    // Castling moves
    const castlingMoves = this.getCastlingMoves(pos);
    moves.push(...castlingMoves);

    return moves;
  }

  private getCastlingMoves(kingPos: [number, number]): [number, number][] {
    const moves: [number, number][] = [];
    const king = this.getPieceAt(kingPos);
    
    if (!king || king.type !== "king" || king.hasMoved) return moves;
    
    // King must not be in check
    if (this.isKingInCheck(king.color)) return moves;

    const row = kingPos[0];
    const color = king.color;

    // Kingside castling (right)
    const rightRook = this.getPieceAt([row, 7]);
    if (rightRook && rightRook.type === "rook" && rightRook.color === color && !rightRook.hasMoved) {
      // Check if squares between king and rook are empty
      if (!this.getPieceAt([row, 5]) && !this.getPieceAt([row, 6])) {
        // Check if king doesn't pass through check
        const testBoard1 = this.simulateMove(kingPos, [row, 5]);
        if (!this.isKingInCheck(color, testBoard1)) {
          moves.push([row, 6]);
        }
      }
    }

    // Queenside castling (left)
    const leftRook = this.getPieceAt([row, 0]);
    if (leftRook && leftRook.type === "rook" && leftRook.color === color && !leftRook.hasMoved) {
      // Check if squares between king and rook are empty
      if (!this.getPieceAt([row, 1]) && !this.getPieceAt([row, 2]) && !this.getPieceAt([row, 3])) {
        // Check if king doesn't pass through check
        const testBoard1 = this.simulateMove(kingPos, [row, 3]);
        if (!this.isKingInCheck(color, testBoard1)) {
          moves.push([row, 2]);
        }
      }
    }

    return moves;
  }

  movePiece(from: [number, number], to: [number, number]): boolean {
    const piece = this.getPieceAt(from);
    if (!piece || piece.color !== this.currentPlayer) return false;

    const validMoves = this.getValidMoves(from);
    if (!validMoves.some(m => m[0] === to[0] && m[1] === to[1])) return false;

    const captured = this.getPieceAt(to);
    this.moveHistory.push({ from, to, captured: captured || undefined });

    // Mark piece as moved
    piece.hasMoved = true;
    this.setPieceAt(to, piece);
    this.setPieceAt(from, null);

    // Handle castling
    if (piece.type === "king") {
      const fromCol = from[1];
      const toCol = to[1];
      
      // Kingside castling
      if (toCol === 6 && fromCol === 4) {
        const rook = this.getPieceAt([from[0], 7]);
        if (rook) {
          rook.hasMoved = true;
          this.setPieceAt([from[0], 5], rook);
          this.setPieceAt([from[0], 7], null);
        }
      }
      
      // Queenside castling
      if (toCol === 2 && fromCol === 4) {
        const rook = this.getPieceAt([from[0], 0]);
        if (rook) {
          rook.hasMoved = true;
          this.setPieceAt([from[0], 3], rook);
          this.setPieceAt([from[0], 0], null);
        }
      }
    }

    // Handle pawn promotion
    if (piece.type === "pawn" && (to[0] === 0 || to[0] === 7)) {
      this.setPieceAt(to, { ...piece, type: "queen" });
    }

    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
    return true;
  }

  private simulateMove(from: [number, number], to: [number, number]): (Piece | null)[][] {
    const boardCopy = this.board.map(row => [...row]);
    const piece = boardCopy[from[0]][from[1]];
    boardCopy[to[0]][to[1]] = piece;
    boardCopy[from[0]][from[1]] = null;
    return boardCopy;
  }

  private isKingInCheck(color: PieceColor, board?: (Piece | null)[][]): boolean {
    const checkBoard = board || this.board;
    let kingPos: [number, number] | null = null;

    // Find king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = checkBoard[row][col];
        if (piece && piece.type === "king" && piece.color === color) {
          kingPos = [row, col];
          break;
        }
      }
    }

    if (!kingPos) return false;

    // Check if any enemy piece can attack the king
    const enemyColor = color === "white" ? "black" : "white";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = checkBoard[row][col];
        if (piece && piece.color === enemyColor) {
          if (this.canPieceAttack([row, col], kingPos, checkBoard)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private canPieceAttack(from: [number, number], to: [number, number], board: (Piece | null)[][]): boolean {
    const piece = board[from[0]][from[1]];
    if (!piece) return false;

    const moves = this.getPieceMoves(from, board);
    return moves.some(m => m[0] === to[0] && m[1] === to[1]);
  }

  private getPieceMoves(pos: [number, number], board: (Piece | null)[][]): [number, number][] {
    const piece = board[pos[0]][pos[1]];
    if (!piece) return [];

    const [row, col] = pos;
    const moves: [number, number][] = [];

    if (piece.type === "pawn") {
      const direction = piece.color === "white" ? -1 : 1;
      const nextRow = row + direction;
      if (nextRow >= 0 && nextRow <= 7) {
        for (const dcol of [-1, 1]) {
          const captureCol = col + dcol;
          if (captureCol >= 0 && captureCol <= 7) {
            const target = board[nextRow][captureCol];
            if (target && target.color !== piece.color) {
              moves.push([nextRow, captureCol]);
            }
          }
        }
      }
    } else if (piece.type === "rook") {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
          const target = board[newRow][newCol];
          if (!target) {
            moves.push([newRow, newCol]);
          } else {
            if (target.color !== piece.color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      }
    } else if (piece.type === "knight") {
      const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          const target = board[newRow][newCol];
          if (!target || target.color !== piece.color) {
            moves.push([newRow, newCol]);
          }
        }
      }
    } else if (piece.type === "bishop") {
      const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
          const target = board[newRow][newCol];
          if (!target) {
            moves.push([newRow, newCol]);
          } else {
            if (target.color !== piece.color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      }
    } else if (piece.type === "queen") {
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      for (const [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          const newRow = row + dr * i;
          const newCol = col + dc * i;
          if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
          const target = board[newRow][newCol];
          if (!target) {
            moves.push([newRow, newCol]);
          } else {
            if (target.color !== piece.color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
        }
      }
    } else if (piece.type === "king") {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            const target = board[newRow][newCol];
            if (!target || target.color !== piece.color) {
              moves.push([newRow, newCol]);
            }
          }
        }
      }
    }

    return moves;
  }

  isCheckmate(color: PieceColor): boolean {
    if (!this.isKingInCheck(color)) return false;

    // Check if any legal move exists
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          const moves = this.getValidMoves([row, col]);
          if (moves.length > 0) return false;
        }
      }
    }

    return true;
  }

  isStalemate(color: PieceColor): boolean {
    // King must NOT be in check for stalemate
    if (this.isKingInCheck(color)) return false;

    // Check if any legal move exists
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          const moves = this.getValidMoves([row, col]);
          if (moves.length > 0) return false;
        }
      }
    }

    return true;
  }

  getAIMove(): [[number, number], [number, number]] | null {
    const moves: Array<{ from: [number, number]; to: [number, number]; score: number }> = [];

    // Collect all possible moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === "black") {
          const validMoves = this.getValidMoves([row, col]);
          for (const to of validMoves) {
            let score = 0;

            // Capture scoring
            const target = this.getPieceAt(to);
            if (target) {
              score += this.getPieceValue(target.type) * 10;
            }

            // Piece positioning
            score += Math.random() * 10; // Add randomness for variety

            moves.push({ from: [row, col], to, score });
          }
        }
      }
    }

    if (moves.length === 0) return null;

    // Sort by score and apply difficulty
    moves.sort((a, b) => b.score - a.score);

    let selectedMove;
    if (this.difficulty === "easy") {
      selectedMove = moves[Math.floor(Math.random() * Math.min(5, moves.length))];
    } else if (this.difficulty === "medium") {
      selectedMove = moves[Math.floor(Math.random() * Math.min(3, moves.length))];
    } else {
      selectedMove = moves[0]; // Hard: always pick the best move
    }

    return selectedMove ? [selectedMove.from, selectedMove.to] : null;
  }

  private getPieceValue(type: PieceType): number {
    switch (type) {
      case "pawn":
        return 1;
      case "knight":
      case "bishop":
        return 3;
      case "rook":
        return 5;
      case "queen":
        return 9;
      case "king":
        return 1000;
    }
  }
}
