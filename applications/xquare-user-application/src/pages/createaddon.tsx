import styled from "@emotion/styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Title,
  Xquare_colors,
  Typography,
  Input_basic,
  Button_square,
} from "@xquare/user-interfaces";

const CreateAddon = () => {
  const navigate = useNavigate();

  const [teamId, setTeamId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("mysql");
  const [tier, setTier] = useState("nano");
  const [storageGi, setStorageGi] = useState("");

  const isValid =
    teamId.trim() !== "" &&
    name.trim() !== "" &&
    type.trim() !== "" &&
    tier.trim() !== "" &&
    storageGi.trim() !== "";

  return (
    <Container>
      <ContentsArea>
        <Title title="Addon 생성" subTitle="Create a new addon for XQUARE" />
      </ContentsArea>

      <Contents>
        {/* Step0 */}
        <ValueBox>
          <Typography size="5x" weight="bold">
            Step0. 기본 정보
          </Typography>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Team ID
            </Typography>
            <Input_basic
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="팀 ID를 입력하세요"
              width="950px"
              height="35px"
            />
          </InputArea>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Addon Name
            </Typography>
            <Input_basic
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Addon Name"
              width="950px"
              height="35px"
            />
          </InputArea>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              DB Type
            </Typography>

            <SelectBox value={type} onChange={(e) => setType(e.target.value)}>
              <option value="mysql">mysql</option>
              <option value="redis">redis</option>
              <option value="postgres">postgres</option>
            </SelectBox>
          </InputArea>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Tier
            </Typography>

            <SelectBox value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="nano">nano</option>
              <option value="micro">micro</option>
              <option value="small">small</option>
              <option value="medium">medium</option>
            </SelectBox>
          </InputArea>

          <InputArea>
            <Typography size="5x" weight="semiBold">
              Storage (Gi)
            </Typography>
            <Input_basic
              type="number"
              value={storageGi}
              onChange={(e) => setStorageGi(e.target.value)}
              placeholder="ex) 20 (Gi)"
              width="950px"
              height="35px"
            />
          </InputArea>
        </ValueBox>

        {/* Buttons */}
        <ButtonGroup>
          <Button_square
            type="button"
            width="120px"
            height="50px"
            onClick={() => navigate("/")}
          >
            취소
          </Button_square>

          <Button_square
            type="submit"
            width="120px"
            height="50px"
            disabled={!isValid}
          >
            생성
          </Button_square>
        </ButtonGroup>
      </Contents>
    </Container>
  );
};

export default CreateAddon;

// --- Styled Components (기존과 동일) ---

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 10px 40px;
`;

const ContentsArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  width: 100%;
  margin-bottom: 15px;
  gap: 15px;
`;

const Contents = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ValueBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 5px;
  width: 100%;
  height: 40px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2rem;
`;

const SelectBox = styled.select`
  width: 300px;
  height: 35px;
  padding: 0 10px;
  border-radius: 6px;
  background-color: white;
  outline: none;
  border: none;
  font-family: "Pretendard";
  font-size: 17px;
  font-weight: 500;
  text-align: right;
  color: ${Xquare_colors.gray[500]};
`;
