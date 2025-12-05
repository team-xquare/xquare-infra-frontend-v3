import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Logo,
  Input_text,
  Typography,
  Button_square,
  Xquare_colors,
} from "@xquare/user-interfaces";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container>
      <Left>
        <img src={Logo} alt="Logo" style={{ width: "50%", height: "auto" }} />
      </Left>
      <Right>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography size="10x" weight="extraBold" align="center">
            XQUARE
          </Typography>
          <Input_text
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력해주세요"
            title="에ㅓㄹ"
            type="text"
          />
          <Input_text
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            type="password"
            title=""
          />
        </div>
        <Button_square>로그인</Button_square>
      </Right>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100;
  width: 100vw;
  background-color: ${Xquare_colors.white};
`;

const Left = styled.div`
  display: flex;
  width: 65vw;
  background-color: ${Xquare_colors.purple[400]};
  box-shadow: inset -4px 0 10px rgba(0, 0, 0, 0.3);
  align-items: center;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 200px;
`;

export default LoginPage;
