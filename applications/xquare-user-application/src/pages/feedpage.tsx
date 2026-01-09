import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Feed } from "@xquare/user-interfaces";
import { useAuthGuard } from "@xquare/hooks";
import { useEffect } from "react";

const FeedPage = () => {
  useAuthGuard();

  useEffect(() => {
    document.title = "XQUARE | Feed";
  }, []);

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Feed</title>
      </Helmet>
      <Feed page={3} />
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
  cursor: default;
`;

export default FeedPage;
