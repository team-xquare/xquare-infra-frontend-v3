import styled from "@emotion/styled";
import Xquare_colors from "../../styles";
import { getSelectedTeam } from "@xquare/utils";

function LogContents() {
  const serverlog = `
$ turbo run dev "--filter=@xquare/user-application"

• Packages in scope: @xquare/user-application
• Running dev in 1 packages
• Remote caching disabled

@xquare/user-application:dev:  cache bypass, force executing c64837b090f3051c
@xquare/user-application:dev:  $ vite
@xquare/user-application:dev: 
@xquare/user-application:dev:  VITE v7.2.6  ready in 387 ms
@xquare/user-application:dev:
@xquare/user-application:dev:  ➜  Local:   http://localhost:5173/
@xquare/user-application:dev:  ➜  Network: use --host to expose
`;
  const buildlog = ``;

  const team = getSelectedTeam()?.name;

  return (
    <Container>
      <Unknown>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            marginBottom: "18px",
            color: String(Xquare_colors.purple[400]),
          }}
        >
          서비스 준비중입니다
        </h1>

        <p
          style={{
            fontSize: "27px",
            color: String(Xquare_colors.black),
            fontWeight: 700,
            maxWidth: "520px",
            lineHeight: "1.4",
            whiteSpace: "pre-line",
          }}
        >
          {team ? (
            <a
              href={`https://${team}-observability-dashboard.dsmhs.kr/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "black", textDecoration: "none" }}
            >
              Grafana 대시보드 바로가기
            </a>
          ) : (
            <span>팀을 선택한 후 Grafana 대시보드를 확인할 수 있습니다</span>
          )}
        </p>
      </Unknown>

      <div style={{ position: "relative", width: "100%" }}>
        <LogBox hasBuild={!!buildlog}>{serverlog}</LogBox>
        <LogType>application</LogType>
      </div>
      {buildlog && (
        <div style={{ position: "relative", width: "100%" }}>
          <LogBox hasBuild={true}>{buildlog}</LogBox>
          <LogType>build</LogType>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
`;

const Unknown = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 20px;
  text-align: center;
  z-index: 100;

  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.92);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogBox = styled.pre<{ hasBuild: boolean }>`
  width: 100%;
  height: ${(props) => (props.hasBuild ? "250px" : "500px")};

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
  top: 25px;
  right: 20px;

  padding: 4px 8px;
  border-radius: 16px;
  background-color: ${Xquare_colors.blue[500]};
  font-size: 13px;
  font-weight: 400;
  color: ${Xquare_colors.white};
`;

export default LogContents;
