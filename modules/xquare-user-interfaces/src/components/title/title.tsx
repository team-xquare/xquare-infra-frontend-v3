/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";

interface TitleProps {
  title: string;
  subTitle?: string;
}

const TitleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;

  font-family: "Pretendard";
`;

const MainTitle = styled.h1`
  font-size: 29px;
  font-weight: 600;
  color: ${Xquare_colors.black};
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 17px;
  font-weight: 400;
  color: ${Xquare_colors.black};
  margin-bottom: 4px;
`;

const Title: React.FC<TitleProps> = ({ title, subTitle }) => {
  return (
    <TitleContainer>
      <MainTitle>{title}</MainTitle>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
    </TitleContainer>
  );
};

export { Title };
