import styled from "@emotion/styled";
import { Notice } from "@xquare/user-interfaces";
import { useAuthGuard } from "@xquare/hooks";

const NoticePage = () => {
  useAuthGuard();
  return (
    <Container>
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
  padding: 10px 40px;
`;

export default NoticePage;
