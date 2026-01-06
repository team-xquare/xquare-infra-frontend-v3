import styled from "@emotion/styled";
import { Typography } from "../typography/index";

interface ErrorMessageProps {
  message: string;
  style?: React.CSSProperties;
}

export function ErrorMessage({ message, style }: ErrorMessageProps) {
  return (
    <ErrorMessageContainer style={style}>
      <Typography size="5x" weight="regular" style={{ color: "red" }}>
        {message}
      </Typography>
    </ErrorMessageContainer>
  );
}

const ErrorMessageContainer = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  background-color: #fee;
  border-radius: 5px;
  cursor: default;
`;

export default ErrorMessage;
