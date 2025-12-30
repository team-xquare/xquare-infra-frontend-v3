import styled from "@emotion/styled";
import Xquare_colors from "../../styles";
import { Typography } from "../typography/index";
import PodImg from "../../assets/pod.svg";
import DatabaseImg from "../../assets/db.svg";
import type { ApplicationDetail } from "@xquare/utils";

interface SummaryContentsProps {
  appDetail?: ApplicationDetail;
}

function SummaryContents({ appDetail }: SummaryContentsProps) {
  const serverlog = `025-10-10 15:17:10+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.43-1.el9 started.
2025-10-10 15:17:13+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2025-10-10 15:17:13+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.43-1.el9 started.
'/var/lib/mysql/mysql.sock' -> '/var/run/mysqld/mysqld.sock'
2025-10-10T15:17:14.292976Z 0 [Warning] [MY-011068] [Server] The syntax '--skip-host-cache' is deprecated and will be removed in a future release. Please use SET GLOBAL host_cache_size=0 instead.
2025-10-10T15:17:14.296089Z 0 [System] [MY-010116] [Server] /usr/sbin/mysqld (mysqld 8.0.43) starting as process 1
2025-10-10T15:17:14.339583Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2025-10-10T15:17:18.254530Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2025-10-10T15:17:18.896897Z 0 [System] [MY-010229] [Server] Starting XA crash recovery...
2025-10-10T15:17:18.913815Z 0 [System] [MY-010232] [Server] XA crash recovery finished.
2025-10-10T15:17:19.091948Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
2025-10-10T15:17:19.091987Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
2025-10-10T15:17:19.273334Z 0 [Warning] [MY-011810] [Server] Insecure configuration for --pid-file: Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
2025-10-10T15:17:19.376056Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
2025-10-10T15:17:19.376123Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.43'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.`;

  const title = appDetail?.name || "Application";
  const domain = `${appDetail?.name || "app"}.xquare.app`;
  const description = `Application ID: ${appDetail?.id || "N/A"}`;
  const type: "application" | "database" = "application"; // 또는 appDetail에서 유추
  const repository = appDetail?.configuration?.github
    ? `${appDetail.configuration.github.owner}/${appDetail.configuration.github.repo}`
    : "N/A";
  const owner = appDetail?.configuration?.github?.owner || "N/A";
  const health =
    appDetail?.status === "running"
      ? 5
      : appDetail?.status === "pending"
        ? 3
        : 1;
  const lastDeploy = "2025-10-10 15:00"; // 실제 API에서 제공되면 사용
  const lastbuild = "2025-10-10 14:45"; // 실제 API에서 제공되면 사용

  return (
    <Container>
      <Info>
        <Value>
          <Heading>
            <Typo>
              <Typography size="7x" weight="semiBold">
                {title}
              </Typography>
              <Typography size="4x" weight="light">
                {domain}
              </Typography>
            </Typo>
            <Icons>
              {(type as string) === "database" ? (
                <img src={DatabaseImg} alt="Database" height={55} />
              ) : (
                <img src={PodImg} alt="POD" />
              )}
            </Icons>
          </Heading>
          <Typography size="5x" weight="medium">
            {description}
          </Typography>
          <Status>
            <Typography size="5x" weight="semiBold">
              Repository
            </Typography>

            <Typography
              size="4x"
              weight="semiBold"
              color={String(Xquare_colors.gray[500])}
            >
              {repository}
            </Typography>
          </Status>
          <Status>
            <Typography size="5x" weight="semiBold">
              Owner
            </Typography>

            <Typography
              size="4x"
              weight="semiBold"
              color={String(Xquare_colors.gray[500])}
            >
              {owner}
            </Typography>
          </Status>
          <Status>
            <Typography size="5x" weight="semiBold">
              Traffic
            </Typography>

            <TrafficWrapper>
              {Array.from({ length: Number(health) }).map((_, idx) => (
                <Box key={idx} isFirst={idx === 0 && health <= 2} />
              ))}
            </TrafficWrapper>
          </Status>

          <Status>
            <Typography size="5x" weight="semiBold">
              Last Deploy
            </Typography>

            <Typography
              size="4x"
              weight="semiBold"
              color={String(Xquare_colors.gray[500])}
            >
              {lastDeploy}
            </Typography>
          </Status>
          <Status>
            <Typography size="5x" weight="semiBold">
              Last Build
            </Typography>

            <Typography
              size="4x"
              weight="semiBold"
              color={String(Xquare_colors.gray[500])}
            >
              {lastbuild}
            </Typography>
          </Status>
        </Value>
        <Area></Area>
      </Info>
      <div style={{ position: "relative", width: "100%" }}>
        <LogBox>{serverlog}</LogBox>
        <LogType>application</LogType>
      </div>
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

const Info = styled.div`
  width: 100%;
  height: 260px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  margin-bottom: 14px;
`;

const Value = styled.div`
  width: 35%;
  height: 100%;
  border-radius: 12px;

  margin-right: 4%;
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
  gap: 5px;
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
  margin-top: 7px;
  gap: 25px;
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

const Area = styled.div`
  width: 65%;
  height: 100%;

  border: 2px solid ${Xquare_colors.gray[300]};
  border-radius: 12px;
`;

const LogBox = styled.div`
  width: 100%;
  height: 270px;

  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 18px;
  border-radius: 9px;

  overflow-y: scroll;
  white-space: pre-wrap;
  word-break: break-all;

  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${Xquare_colors.purple[300]};
    border-radius: 2px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  text-align: justify;
  font-family: "pretendard";
  font-size: 15px;

  box-sizing: border-box;
`;

const LogType = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;

  padding: 4px 8px;
  border-radius: 16px;
  background-color: ${Xquare_colors.blue[500]};
  font-size: 13px;
  font-weight: 400;
  color: ${Xquare_colors.white};
`;

export default SummaryContents;
