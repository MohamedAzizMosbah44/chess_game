export type PieceTheme = "unicode" | "ascii" | "symbols" | "fancy" | "letters" | "emoji";

export interface PieceSet {
  pawn: string;
  knight: string;
  bishop: string;
  rook: string;
  queen: string;
  king: string;
}

export const pieceThemes: Record<PieceTheme, { name: string; white: PieceSet; black: PieceSet }> = {
  unicode: {
    name: "Unicode (Classic)",
    white: {
      pawn: "♙",
      knight: "♘",
      bishop: "♗",
      rook: "♖",
      queen: "♕",
      king: "♔",
    },
    black: {
      pawn: "♟",
      knight: "♞",
      bishop: "♝",
      rook: "♜",
      queen: "♛",
      king: "♚",
    },
  },
  ascii: {
    name: "ASCII",
    white: {
      pawn: "P",
      knight: "N",
      bishop: "B",
      rook: "R",
      queen: "Q",
      king: "K",
    },
    black: {
      pawn: "p",
      knight: "n",
      bishop: "b",
      rook: "r",
      queen: "q",
      king: "k",
    },
  },
  symbols: {
    name: "Symbols",
    white: {
      pawn: "⚪",
      knight: "🐴",
      bishop: "🎯",
      rook: "🏰",
      queen: "👑",
      king: "⚜️",
    },
    black: {
      pawn: "⚫",
      knight: "🐎",
      bishop: "🎪",
      rook: "🏯",
      queen: "💎",
      king: "🔱",
    },
  },
  fancy: {
    name: "Fancy",
    white: {
      pawn: "◯",
      knight: "◈",
      bishop: "◆",
      rook: "◻",
      queen: "◉",
      king: "◎",
    },
    black: {
      pawn: "●",
      knight: "◆",
      bishop: "◊",
      rook: "■",
      queen: "⊙",
      king: "⊗",
    },
  },
  letters: {
    name: "Letters",
    white: {
      pawn: "P",
      knight: "N",
      bishop: "B",
      rook: "R",
      queen: "Q",
      king: "K",
    },
    black: {
      pawn: "p",
      knight: "n",
      bishop: "b",
      rook: "r",
      queen: "q",
      king: "k",
    },
  },
  emoji: {
    name: "Emoji",
    white: {
      pawn: "🤍",
      knight: "🦄",
      bishop: "⛪",
      rook: "🏰",
      queen: "👸",
      king: "🤴",
    },
    black: {
      pawn: "🖤",
      knight: "🐉",
      bishop: "🕌",
      rook: "🏛️",
      queen: "👯",
      king: "🧔",
    },
  },
};

export const getThemeSymbol = (theme: PieceTheme, color: "white" | "black", piece: keyof PieceSet): string => {
  return pieceThemes[theme][color][piece];
};
