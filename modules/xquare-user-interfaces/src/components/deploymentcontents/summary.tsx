import React from "react";
import styled from "@emotion/styled";

function SecretContents() {
  return (
    <Container>
      <div></div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default SecretContents;
