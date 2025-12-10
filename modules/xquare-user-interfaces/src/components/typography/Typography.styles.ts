import styled from "@emotion/styled";

export const fontSizes = {
  "1x": "10px",
  "2x": "12px",
  "3x": "14px",
  "4x": "16px",
  "5x": "18px",
  "6x": "20px",
  "7x": "24px",
  "8x": "28px",
  "9x": "32px",
  "10x": "35px",
  "11x": "48px",
};

export const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const Typography = styled.span<{
  $size: keyof typeof fontSizes;
  $weight: keyof typeof fontWeights;
  $color: string;
  $align: "left" | "center" | "right" | "justify";
  $underline: boolean;
}>`
  font-size: ${({ $size }) => fontSizes[$size]};
  font-weight: ${({ $weight }) => fontWeights[$weight]};
  color: ${({ $color }) => $color};
  text-align: ${({ $align }) => $align};
  text-decoration: ${({ $underline }) => ($underline ? "underline" : "none")};
`;
