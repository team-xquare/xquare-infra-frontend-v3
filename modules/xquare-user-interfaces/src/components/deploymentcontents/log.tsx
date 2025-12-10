import styled from "@emotion/styled";
import Xquare_colors from "../../styles";

function LogContents() {
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

  const buildlog = `2025-10-10 15:17:10+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.43-1.el9 started.
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

  return (
    <Container>
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
  min-height: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LogBox = styled.pre<{ hasBuild: boolean }>`
  width: 100%;
  height: ${(props) => (props.hasBuild ? "250px" : "500px")};

  background-color: #1e1e1e;
  color: #d4d4d4;
  margin: 5px;
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

export default LogContents;
