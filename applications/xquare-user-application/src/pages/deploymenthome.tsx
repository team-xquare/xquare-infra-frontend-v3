import React from "react";
import styled from "@emotion/styled";
import {
  HomeImg,
  Typography,
  Title,
  Xquare_colors,
  Button_round,
} from "@xquare/user-interfaces";

const DeploymentHome = () => {
  const handleAddApplicationClick = () => {
    // Application 추가하기 버튼 클릭 시 동작할 함수
    console.log("Application 추가하기 버튼 클릭됨");
  };

  const handleAddAddonsClick = () => {
    // Addons 추가하기 버튼 클릭 시 동작할 함수
    console.log("Addons 추가하기 버튼 클릭됨");
  };
  return (
    <Container>
      <ContentsArea>
        <Title
          title={`Deployments`}
          subTitle={"Deploy your service via xquare infra"}
        ></Title>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button_round width="180px" onClick={handleAddApplicationClick}>
            Application 추가하기
          </Button_round>
          <Button_round width="150px" onClick={handleAddAddonsClick}>
            Addons 추가하기
          </Button_round>
        </div>
      </ContentsArea>
      <HeroSection>
        <ImgText style={{ width: "75%" }}>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            NEW
          </Typography>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            XQUARE
          </Typography>
          <Typography size="10x" weight="extraBold" align="left" color="white">
            INFRASTRUCTURE
          </Typography>
        </ImgText>
      </HeroSection>
      <DploymentSell></DploymentSell>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
`;

const ContentsArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 12px;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  background-image: url(${HomeImg});
  margin-bottom: 15px;
`;

const ImgText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DploymentSell = styled.div`
  width: 100%;
  min-height: 200px;
`;

export default React.memo(DeploymentHome);
