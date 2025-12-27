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
  traffic?: number | string;
  health?: number | string;
  lastdeploy?: string | null;
  lastbuild?: string | null;
  charge?: string | null;
}

function AddonItem({
  title = "undefined",
  domain = "https://undefined.dsmhs.kr",
  type = "pod",
  description = "서비스 설명이 없습니다.",
  traffic,
  health,
  lastdeploy,
  lastbuild,
  charge,
}: AddonItemProps) {
  const safeHealth =
    typeof health === "number" && Number.isFinite(health) && health > 0
      ? health
      : null;
  const safeTraffic =
    typeof traffic === "number" && Number.isFinite(traffic)
      ? `${traffic}req/sec`
      : "N/A";
  const safeLastDeploy = lastdeploy ?? "N/A";
  const safeLastBuild = lastbuild ?? "N/A";
  const safeCharge = charge ?? "N/A";

  const renderHealth = () => {
    if (safeHealth) {
      return (
        <TrafficWrapper>
          {Array.from({ length: safeHealth }).map((_, idx) => (
            <Box key={idx} isFirst={idx === 0 && safeHealth <= 2} />
          ))}
        </TrafficWrapper>
      );
    }

    return (
      <Typography
        size="3x"
        weight="regular"
        color={String(Xquare_colors.gray[500])}
      >
        N/A
      </Typography>
    );
  };

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
              Health
            </Typography>
            {renderHealth()}
          </ItemSet>
          <ItemSet>
            <Typography size="4x" weight="semiBold">
              {"Traffic"}
            </Typography>
            <Typography
              size="3x"
              weight="regular"
              color={String(Xquare_colors.gray[500])}
            >
              {safeTraffic}
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
              {safeLastDeploy}
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
              {safeLastBuild}
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
          {safeCharge}
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
  width: 100%;
  min-height: 190px;
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;

  &:hover {
    background-color: ${Xquare_colors.gray[300]};
    cursor: pointer;
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
`;

const Typo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0; /* allow text to wrap within available space */

  & > * {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 44px;
    height: 44px;
  }
`;

const Status = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  gap: 25px;
  width: 100%;
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
