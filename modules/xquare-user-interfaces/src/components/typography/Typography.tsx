/** @jsxImportSource @emotion/react */
import * as S from "./Typography.styles";

export interface TextProps {
  size?: keyof typeof S.fontSizes;
  weight?: keyof typeof S.fontWeights;
  color?: string;
  align?: "left" | "center" | "right" | "justify";
  underline?: boolean;
  as?: React.ElementType;
  children: React.ReactNode;
}

const Typography = ({
  size = "3x",
  weight = "regular",
  color = "#000",
  align = "left",
  underline = false,
  as = "span",
  children,
  ...props
}: TextProps) => {
  return (
    <S.Typography
      as={as}
      $size={size}
      $weight={weight}
      $color={color}
      $align={align}
      $underline={underline}
      {...props}
    >
      {children}
    </S.Typography>
  );
};

export { Typography };
