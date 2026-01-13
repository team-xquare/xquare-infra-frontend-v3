import styled from "@emotion/styled";
import Xquare_colors from "../../styles";
import { Typography } from "../typography/index";
import { ErrorMessage } from "../errormessage";
import { LoadingOverlay } from "../loadingoverlays";
import PodImg from "../../assets/pod.svg";
import DatabaseImg from "../../assets/db.svg";
import type { ApplicationDetail } from "@xquare/utils";
import { getSelectedTeam } from "@xquare/utils";

interface SummaryContentsProps {
  appDetail?: ApplicationDetail;
  loading?: boolean;
  error?: Error | null;
}

function SummaryContents({ appDetail, loading, error }: SummaryContentsProps) {
  const serverlog = `$ turbo run dev "--filter=@xquare/user-application"

• Packages in scope: @xquare/user-application
• Running dev in 1 packages
• Remote caching disabled

@xquare/user-application:dev:  cache bypass, force executing c64837b090f3051c
@xquare/user-application:dev:  $ vite
@xquare/user-application:dev: 
@xquare/user-application:dev:  VITE v7.2.6  ready in 387 ms
@xquare/user-application:dev:
@xquare/user-application:dev:  ➜  Local:   http://localhost:5173/
@xquare/user-application:dev:  ➜  Network: use --host to expose`;

  const title = appDetail?.name || "Application";
  const domain = `${appDetail?.name || "app"}.xquare.app`;
  const type: "application" | "database" = "application";
  const description = appDetail
    ? `Status: ${appDetail.status} | Tier: ${appDetail.configuration.tier}`
    : "N/A";
  const repository = appDetail?.configuration?.github
    ? `${appDetail.configuration.github.owner}/${appDetail.configuration.github.repo}`
    : "N/A";
  const owner = appDetail?.configuration?.github?.owner || "N/A";
  const lastDeploy = "N/A";
  const lastbuild = "N/A";
  const team = getSelectedTeam()?.name ?? "";

  return (
    <Container>
      <LoadingOverlay isLoading={loading} />
      {error && (
        <ErrorMessage
          message={error.message || "애플리케이션 정보를 불러올 수 없습니다."}
        />
      )}
      {!loading && !error && (
        <>
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
              <div style={{ height: "15px" }}></div>
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
            <Unknown>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  marginBottom: "10px",
                  color: String(Xquare_colors.purple[400]),
                }}
              >
                서비스 준비중입니다
              </h1>

              <p
                style={{
                  fontSize: "22px",
                  color: String(Xquare_colors.black),
                  fontWeight: 700,
                  maxWidth: "520px",
                  lineHeight: "1.4",
                  whiteSpace: "pre-line",
                }}
              >
                <a
                  href={`https://${team}-observability-dashboard.dsmhs.kr/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Grafana 대시보드 바로가기
                </a>
              </p>
            </Unknown>
            <LogBox>{serverlog}</LogBox>
            <LogType>application</LogType>
          </div>
        </>
      )}
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

const Unknown = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  z-index: 999;

  font-size: 18px;
  opacity: 0.92;
  background-color: ${Xquare_colors.white};

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

const Area = styled.div`
  width: 65%;
  height: 100%;

  // border: 2px solid ${Xquare_colors.gray[300]};
  border: none;
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
