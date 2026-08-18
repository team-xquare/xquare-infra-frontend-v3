/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";
import { Link } from "react-router-dom";

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
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
  cursor: default;
`;

const StyledInput = styled.input<InputProps>`
  width: ${({ width }) => width || "300px"};
  height: ${({ height }) => height || "60px"};

  border: none;
  border-bottom: 1.2px solid ${Xquare_colors.gray[500]};
  background-color: ${Xquare_colors.white};
  cursor: text;

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
    cursor: not-allowed;

    &::placeholder {
      color: ${Xquare_colors.gray[300]};
    }
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 1rem;
  cursor: default;
`;

const Title = styled.a<TitleProps>`
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ titleColor }) => titleColor};
`;

// 컴포넌트
export const Input_text = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      placeholder,
      disabled = false,
      type = "text",
      width,
      height,
      title,
      titleColor,
      onKeyDown,
    },
    ref,
  ) => {
    return (
      <Wraper>
        <StyledInput
          ref={ref}
          width={width}
          height={height}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
        />
        <Box>
          {title && (
            <Link
              to="/find-pwd"
              style={{
                textDecoration: "none",
                height: "1.8rem",
                color: "inherit",
              }}
            >
              <Title titleColor={titleColor}>{title}</Title>
            </Link>
          )}
        </Box>
      </Wraper>
    );
  },
);

Input_text.displayName = "Input_text";
