import styled from "@emotion/styled";
import { Xquare_colors } from "../../styles/colors";
import { Typography } from "../typography";
import PodImg from "../../assets/pod.svg";
import DatabaseImg from "../../assets/db.svg";

interface AddonItemProps {
  title: string;
  domain: string;
  type: string;
  description: string;
  traffic: number;
  health: number;
  lastdeploy: string;
  lastbuild: string;
  charge: string;
}

function AddonItem({
  title = "undefined",
  domain = "https://undefined.dsmhs.kr",
  type = "pod",
  description = "서비스 설명이 없습니다.",
  traffic = 0,
  health = 1,
  lastdeploy = "0000.00.00",
  lastbuild = "0000.00.00",
  charge = "undefined",
}: AddonItemProps) {
  return (
    <Container>
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
        <Status>
          <ItemSet>
            <Typography size="4x" weight="semiBold">
              Traffic
            </Typography>

            <TrafficWrapper>
              {Array.from({ length: Number(health) }).map((_, idx) => (
                <Box key={idx} isFirst={idx === 0 && health <= 2} />
              ))}
            </TrafficWrapper>
          </ItemSet>
          <ItemSet>
            <Typography size="4x" weight="semiBold">
              {"Traefix"}
            </Typography>
            <Typography
              size="3x"
              weight="regular"
              color={String(Xquare_colors.gray[500])}
            >
              {traffic}req/sec
            </Typography>
          </ItemSet>
        </Status>
        <Status>
          <ItemSet>
            <Typography size="4x" weight="semiBold">
              Last Deploy
            </Typography>
            <Typography
              size="3x"
              weight="regular"
              color={String(Xquare_colors.gray[500])}
            >
              {lastdeploy}
            </Typography>
          </ItemSet>
          <ItemSet>
            <Typography size="4x" weight="semiBold">
              Last Build
            </Typography>
            <Typography
              size="3x"
              weight="regular"
              color={String(Xquare_colors.gray[500])}
            >
              {lastbuild}
            </Typography>
          </ItemSet>
        </Status>
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
  height: 190px;
  width: 385px;
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
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Typo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 6px;
  gap: 25px;
`;

const ItemSet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 13px;
`;

const Charge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const TrafficWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  height: 20px;
`;

const Box = styled.div<{ isFirst: boolean }>`
  width: 17px;
  height: 17px;
  border-radius: 3px;

  background-color: ${({ isFirst }) =>
    isFirst ? Xquare_colors.red[400] : Xquare_colors.green[400]};
  border: 2px solid
    ${({ isFirst }) =>
      isFirst ? Xquare_colors.red[500] : Xquare_colors.green[500]};
`;

export { AddonItem };
