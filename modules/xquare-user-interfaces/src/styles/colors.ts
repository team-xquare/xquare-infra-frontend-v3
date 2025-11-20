export interface ColorGroup {
  [key: string]: string | ColorGroup;
}

export const Xquare_colors: ColorGroup = {
  black: "#000000",
  white: "#FFFFFF",

  gray: {
    300: "#EAEAEA",
    400: "#BEBEBE",
    500: "#ABABAB",
  },

  red: {
    400: "#FF9090",
    500: "#FF5353",
    600: "#FF0000",
  },

  green: {
    400: "#A0FFA8",
    500: "#5CE768",
  },

  blue: {
    500: "#5050FF",
  },

  purple: {
    100: "#EDE0FF",
    200: "#BE9DE8",
    300: "#B982FF",
    400: "#9650FA",
    500: "#8A38F5",
    600: "#433459",
    700: "#0B001A",
  },
};

export default Xquare_colors;
