import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Notice } from "@xquare/user-interfaces";
import { useAuthGuard } from "@xquare/hooks";
import { useEffect } from "react";

const NoticePage = () => {
  useAuthGuard();

  useEffect(() => {
    document.title = "XQUARE | Notice";
  }, []);

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Notice</title>
      </Helmet>
      <Notice page={3} />
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
  padding: 12px 40px;
  padding-top: 22px;
  cursor: default;
`;

export default NoticePage;
