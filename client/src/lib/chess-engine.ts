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
  private evaluationCache: Map<string, number> = new Map();

  // Piece-square tables for positional evaluation
  private pawnTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  private knightTable = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ];

  private bishopTable = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ];

  private rookTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ];

  private queenTable = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ];

  private kingTable = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ];

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
    this.evaluationCache.clear();
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
    const depth = this.difficulty === "easy" ? 2 : this.difficulty === "medium" ? 3 : 4;
    let bestMove: [[number, number], [number, number]] | null = null;
    let bestScore = -Infinity;

    const moves = this.getAllValidMoves("black");
    
    for (const [from, to] of moves) {
      // Simulate move
      const originalPiece = this.getPieceAt(to);
      const fromPiece = this.getPieceAt(from);
      
      this.setPieceAt(to, fromPiece);
      this.setPieceAt(from, null);
      this.currentPlayer = "white";

      const score = this.minimax(depth - 1, -Infinity, Infinity, false);

      // Undo move
      this.setPieceAt(from, fromPiece);
      this.setPieceAt(to, originalPiece);
      this.currentPlayer = "black";

      if (score > bestScore) {
        bestScore = score;
        bestMove = [from, to];
      }
    }

    return bestMove;
  }

  private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
    if (depth === 0) {
      return this.evaluatePosition();
    }

    const moves = this.getAllValidMoves(isMaximizing ? "black" : "white");

    if (moves.length === 0) {
      if (this.isKingInCheck(isMaximizing ? "black" : "white")) {
        return isMaximizing ? -10000 : 10000;
      }
      return 0; // Stalemate
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const [from, to] of moves) {
        const originalPiece = this.getPieceAt(to);
        const fromPiece = this.getPieceAt(from);
        
        this.setPieceAt(to, fromPiece);
        this.setPieceAt(from, null);
        this.currentPlayer = "white";

        const eval_ = this.minimax(depth - 1, alpha, beta, false);
        
        this.setPieceAt(from, fromPiece);
        this.setPieceAt(to, originalPiece);
        this.currentPlayer = "black";

        maxEval = Math.max(eval_, maxEval);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [from, to] of moves) {
        const originalPiece = this.getPieceAt(to);
        const fromPiece = this.getPieceAt(from);
        
        this.setPieceAt(to, fromPiece);
        this.setPieceAt(from, null);
        this.currentPlayer = "black";

        const eval_ = this.minimax(depth - 1, alpha, beta, true);
        
        this.setPieceAt(from, fromPiece);
        this.setPieceAt(to, originalPiece);
        this.currentPlayer = "white";

        minEval = Math.min(eval_, minEval);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private getAllValidMoves(color: PieceColor): Array<[[number, number], [number, number]]> {
    const moves: Array<[[number, number], [number, number]]> = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          const validMoves = this.getValidMovesForColor([row, col], color);
          for (const to of validMoves) {
            moves.push([[row, col], to]);
          }
        }
      }
    }
    
    return moves;
  }

  private getValidMovesForColor(pos: [number, number], color: PieceColor): [number, number][] {
    const piece = this.getPieceAt(pos);
    if (!piece || piece.color !== color) return [];

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
      return !this.isKingInCheck(color, testBoard);
    });
  }

  private evaluatePosition(): number {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          const pieceValue = this.getPieceValue(piece.type);
          const positionBonus = this.getPositionBonus(piece.type, row, col, piece.color);
          const value = pieceValue + positionBonus;

          if (piece.color === "black") {
            score += value;
          } else {
            score -= value;
          }
        }
      }
    }

    // Add tactical bonuses
    score += this.getTacticalBonus();

    return score;
  }

  private getPositionBonus(type: PieceType, row: number, col: number, color: PieceColor): number {
    let table: number[][] = [];

    switch (type) {
      case "pawn":
        table = this.pawnTable;
        break;
      case "knight":
        table = this.knightTable;
        break;
      case "bishop":
        table = this.bishopTable;
        break;
      case "rook":
        table = this.rookTable;
        break;
      case "queen":
        table = this.queenTable;
        break;
      case "king":
        table = this.kingTable;
        break;
    }

    // Flip table for white pieces
    const adjustedRow = color === "white" ? 7 - row : row;
    return table[adjustedRow][col];
  }

  private getTacticalBonus(): number {
    let bonus = 0;

    // Bonus for controlling center
    const centerSquares = [[3, 3], [3, 4], [4, 3], [4, 4]];
    for (const [row, col] of centerSquares) {
      const piece = this.getPieceAt([row, col]);
      if (piece && piece.color === "black") {
        bonus += 10;
      } else if (piece && piece.color === "white") {
        bonus -= 10;
      }
    }

    // Bonus for piece safety
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.getPieceAt([row, col]);
        if (piece && piece.type !== "king") {
          const isAttacked = this.isSquareAttacked([row, col], piece.color === "white" ? "black" : "white");
          if (!isAttacked && piece.color === "black") {
            bonus += 5;
          } else if (!isAttacked && piece.color === "white") {
            bonus -= 5;
          }
        }
      }
    }

    return bonus;
  }

  private isSquareAttacked(square: [number, number], byColor: PieceColor): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === byColor) {
          if (this.canPieceAttack([row, col], square, this.board)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private getPieceValue(type: PieceType): number {
    switch (type) {
      case "pawn":
        return 100;
      case "knight":
      case "bishop":
        return 300;
      case "rook":
        return 500;
      case "queen":
        return 900;
      case "king":
        return 10000;
    }
  }
}
