export type PieceTheme = "classic" | "ascii" | "symbols" | "fancy" | "emoji";

export interface PieceSet {
  pawn: string;
  knight: string;
  bishop: string;
  rook: string;
  queen: string;
  king: string;
}

export const pieceThemes: Record<PieceTheme, { name: string; white: PieceSet; black: PieceSet }> = {
  classic: {
    name: "Classic",
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
