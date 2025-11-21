import styled from "@emotion/styled";

export const fontSizes = {
  xs: "10px",
  sm: "12px",
  md: "14px",
  lg: "16px",
  xl: "18px",
  "1x": "20px",
  "2x": "24px",
  "3x": "28px",
  "4x": "32px",
  "5x": "35px",
  "6x": "48px",
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
  font-family: "Pretendard";
  font-size: ${({ $size }) => fontSizes[$size]};
  font-weight: ${({ $weight }) => fontWeights[$weight]};
  color: ${({ $color }) => $color};
  text-align: ${({ $align }) => $align};
  text-decoration: ${({ $underline }) => ($underline ? "underline" : "none")};
`;
