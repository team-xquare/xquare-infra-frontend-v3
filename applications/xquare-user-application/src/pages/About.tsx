import styled from "@emotion/styled";
import { useEffect } from "react";

function About() {
  useEffect(() => {
    document.title = "XQUARE | About";
  }, []);

  return (
    <Container>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 12px 40px;
  padding-top: 22px;
  cursor: default;
`;

export default About;
