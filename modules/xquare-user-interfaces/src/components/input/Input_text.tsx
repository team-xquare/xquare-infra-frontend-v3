/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

// 타입정의
interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "password" | "email" | "number";
  width?: string;
  height?: string;
  title?: string;
  titleColor?: string;
}

interface TitleProps {
  titleColor?: string;
}

// 스타일 정의
const Wraper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  margin-top: 0.5rem;
`;

const StyledInput = styled.input<InputProps>`
  width: ${({ width }) => width || "300px"};
  height: ${({ height }) => height || "60px"};

  border: none;
  border-bottom: 1.2px solid ${Xquare_colors.gray[500]};
  background-color: ${Xquare_colors.white};

  color: ${Xquare_colors.black};
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1rem;

  &::placeholder {
    color: ${Xquare_colors.gray[500]};
  }

  &:focus {
    outline: none;
    border-bottom: 1.2px solid ${Xquare_colors.purple[500]};
    color: ${Xquare_colors.purple[500]};

    &::placeholder {
      color: ${Xquare_colors.purple[500]};
    }
  }

  &:disabled {
    border-bottom: 1.2px solid ${Xquare_colors.gray[300]};

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 1rem;
`;

const Title = styled.span<TitleProps>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ titleColor }) => titleColor || Xquare_colors.red[500]};
`;

// 컴포넌트
export const Input_text: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  width,
  height,
  title,
  titleColor,
}) => {
  return (
    <Wraper>
      <StyledInput
        width={width}
        height={height}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
      />
      <Box>{title && <Title titleColor={titleColor}>{title}</Title>}</Box>
    </Wraper>
  );
};
