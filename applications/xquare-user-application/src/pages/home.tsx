import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  HomeImg,
  Typography,
  Title,
  Xquare_colors,
} from "@xquare/user-interfaces";

const HomePage = () => {
  const [username, setUsername] = useState("UserName");

  useEffect(() => {
    const fetchUser = async () => {
      // 로직
      setUsername(username);
    };

    fetchUser();
  }, []);

  return (
    <Container>
      <Contents>
        <Title
          title={`Welcome, Back ${username}`}
          subTitle={"Deploy your service via xquare infra"}
        ></Title>
      </Contents>

      <Contents></Contents>

      <HeroSection>
        <ImgText style={{ width: "75%" }}>
          <Typography size="11x" weight="extraBold" align="left" color="white">
            NEW
          </Typography>
          <Typography size="11x" weight="extraBold" align="left" color="white">
            XQUARE
          </Typography>
          <Typography size="11x" weight="extraBold" align="left" color="white">
            INFRASTRUCTURE
          </Typography>
        </ImgText>

        <ImgText>
          <Typography
            size="4x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 UI / UX 디자인
          </Typography>
          <Typography
            size="4x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Application
          </Typography>
          <Typography
            size="4x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Onpremise infrastructure
          </Typography>
          <Typography
            size="4x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 XQUARE 를 통해 배포하세요.
          </Typography>
        </ImgText>
      </HeroSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 40px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 15px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 20px;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 12px;
  display: flex;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  background-image: url(${HomeImg});
`;

const ImgText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default HomePage;
