import styled from "@emotion/styled";
import { Summary } from "@xquare/user-interfaces";

const StatusPage = () => {
  return (
    <Container>
      <Summary page={3} />
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

export default StatusPage;
