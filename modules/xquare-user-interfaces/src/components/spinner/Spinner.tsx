import styled from "@emotion/styled";
import Xquare_colors from "../../styles";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
}

function Spinner({ size = "medium" }: SpinnerProps) {
  return <StyledSpinner size={size} />;
}

const sizeMap = {
  small: "25px",
  medium: "50px",
  large: "65px",
};

const StyledSpinner = styled.div<{ size?: "small" | "medium" | "large" }>`
  width: ${({ size }) => sizeMap[size || "medium"]};
  height: ${({ size }) => sizeMap[size || "medium"]};
  border: 4px solid ${Xquare_colors.gray[300]};
  border-top-color: ${Xquare_colors.purple[500]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export { Spinner };
