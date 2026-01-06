import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Xquare_colors } from "../../styles/colors";
import { Typography } from "../typography";
import PodImg from "../../assets/pod.svg";
import DatabaseImg from "../../assets/db.svg";

interface DeploymentItemProps {
  id: string;
  title: string;
  domain: string;
  type: string;
  description: string;
  charge: string;
}

function DeploymentItem({
  id = "undefined",
  title = "undefined",
  domain = "https://undefined.dsmhs.kr",
  type = "pod",
  description = "서비스 설명이 없습니다.",
  charge = "undefined",
}: DeploymentItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/deployment/view/${id}`);
  };

  return (
    <Container onClick={handleClick}>
      <Contents>
        <Heading>
          <Typo>
            <Typography size="5x" weight="semiBold">
              {title}
            </Typography>
            <Typography size="4x" weight="light">
              {domain}
            </Typography>
          </Typo>
          <Icons>
            {type === "pod" ? (
              <img src={PodImg} alt="POD" />
            ) : (
              <img src={DatabaseImg} alt="Database" />
            )}
          </Icons>
        </Heading>
        <Typography size="4x" weight="medium">
          {description}
        </Typography>
      </Contents>

      <Charge>
        <Typography size="4x" weight="medium">
          인프라 담당자
        </Typography>
        <Typography
          size="4x"
          weight="medium"
          color={String(Xquare_colors.gray[500])}
        >
          {charge}
        </Typography>
      </Charge>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  height: 160px;
  width: 380px;
  padding: 10px;
  border-radius: 8px;

  &:hover {
    background-color: ${Xquare_colors.gray[300]};
    cursor: pointer;
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  cursor: default;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 360px;
  cursor: default;
`;

const Typo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: default;
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: default;
`;

const Charge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: default;
`;

export { DeploymentItem };
