import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  HomeImg,
  Typography,
  Title,
  Xquare_colors,
  Summary,
  Notice,
} from "@xquare/user-interfaces";

const HomePage = () => {
  const [username, setUsername] = useState("UserName");

  useEffect(() => {
    const fetchUser = async () => {
      // 로직
      setUsername(username);
    };

    fetchUser();
  }, [username]);

  return (
    <Container>
      <ContentsArea>
        <Title
          title={`Welcome, Back ${username}`}
          subTitle={"Deploy your service via xquare infra"}
        ></Title>
      </ContentsArea>

      <NoticeContent>
        <Menu></Menu>
        <Contents></Contents>
      </NoticeContent>

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

        <ImgText>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 UI / UX 디자인
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Application
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 Onpremise infrastructure
          </Typography>
          <Typography
            size="3x"
            weight="medium"
            color={String(Xquare_colors.purple[200])}
          >
            새로운 XQUARE 를 통해 배포하세요.
          </Typography>
        </ImgText>
      </HeroSection>
      <NoticeSection>
        <Summary />
        <Notice />
      </NoticeSection>
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
  padding: 10px 40px;
`;

const ContentsArea = styled.div`
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
`;

const NoticeContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 170px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  width: 10%;
  height: 160px;
  border-right: 1px solid ${Xquare_colors.black};
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 160px;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 190px;
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

const NoticeSection = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 250px;
  gap: 25px;
`;

export default HomePage;
