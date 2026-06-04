export type BoardTheme = "classic" | "green" | "blue" | "purple" | "wood" | "marble" | "ocean" | "sunset";

export interface BoardColors {
  light: string;
  dark: string;
  selected: string;
  lastMove: string;
  validMove: string;
}

export const boardThemes: Record<BoardTheme, { name: string; colors: BoardColors }> = {
  classic: {
    name: "Classic",
    colors: {
      light: "#f0d9b5",
      dark: "#b58863",
      selected: "#baca44",
      lastMove: "#ffe135",
      validMove: "#4169e1",
    },
  },
  green: {
    name: "Green",
    colors: {
      light: "#eeeed2",
      dark: "#769656",
      selected: "#baca44",
      lastMove: "#ffe135",
      validMove: "#4169e1",
    },
  },
  blue: {
    name: "Blue",
    colors: {
      light: "#e8f0f5",
      dark: "#4a90e2",
      selected: "#7cb9e8",
      lastMove: "#f0e68c",
      validMove: "#87ceeb",
    },
  },
  purple: {
    name: "Purple",
    colors: {
      light: "#f0e6ff",
      dark: "#9370db",
      selected: "#ba55d3",
      lastMove: "#dda0dd",
      validMove: "#da70d6",
    },
  },
  wood: {
    name: "Wood",
    colors: {
      light: "#d4a574",
      dark: "#8b5a2b",
      selected: "#baca44",
      lastMove: "#ffe135",
      validMove: "#4169e1",
    },
  },
  marble: {
    name: "Marble",
    colors: {
      light: "#f5f5f5",
      dark: "#808080",
      selected: "#ffd700",
      lastMove: "#ffff00",
      validMove: "#87ceeb",
    },
  },
  ocean: {
    name: "Ocean",
    colors: {
      light: "#b0e0e6",
      dark: "#006994",
      selected: "#00d4ff",
      lastMove: "#ffff00",
      validMove: "#87ceeb",
    },
  },
  sunset: {
    name: "Sunset",
    colors: {
      light: "#ffd89b",
      dark: "#ff6b6b",
      selected: "#ffd700",
      lastMove: "#ffff00",
      validMove: "#87ceeb",
    },
  },
};

export const getThemeColors = (theme: BoardTheme): BoardColors => {
  return boardThemes[theme].colors;
};
