import { useEffect, useState, startTransition } from "react";
import styled from "@emotion/styled";
import { Input_basic } from "../input";
import { Typography } from "../typography/index";
import { Xquare_colors } from "../../styles/colors";
import { ErrorMessage } from "../errormessage";
import type {
  ApplicationEndpointDetail,
  ApplicationConfigurationDetail,
  UpdateApplicationConfigurationRequest,
} from "@xquare/utils";

interface RoutesItem {
  url: string;
  port: number;
}

interface RoutesContentsProps {
  applicationId?: number;
  editable: boolean;
  onSave: () => void;
  endpoints?: ApplicationEndpointDetail[];
  configuration?: ApplicationConfigurationDetail;
  onUpdate: (
    applicationId: number,
    request: UpdateApplicationConfigurationRequest
  ) => Promise<boolean>;
}

export default function RoutesContents({
  applicationId,
  editable,
  onSave,
  endpoints,
  configuration,
  onUpdate,
}: RoutesContentsProps) {
  const [routes, setRoutes] = useState<RoutesItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // API로부터 받은 endpoints 데이터로 초기화
  useEffect(() => {
    if (endpoints && endpoints.length > 0) {
      const routesList: RoutesItem[] = [];
      endpoints.forEach((endpoint) => {
        endpoint.routes.forEach((route) => {
          routesList.push({ url: route, port: endpoint.port });
        });
      });
      startTransition(() => {
        setRoutes(routesList);
        setIsDirty(false);
      });
    } else {
      startTransition(() => {
        setRoutes([]);
        setIsDirty(false);
      });
    }
  }, [endpoints]);

  const handleKeyChange = (index: number, v: string) => {
    setSaveError(null);
    setRoutes((prev) =>
      prev.map((s, i) => (i === index ? { ...s, url: v } : s))
    );
    setIsDirty(true);
  };

  const handleValueChange = (index: number, v: string) => {
    setSaveError(null);
    setRoutes((prev) =>
      prev.map((s, i) => (i === index ? { ...s, port: Number(v) } : s))
    );
    setIsDirty(true);
  };

  const removeRoute = (index: number) => {
    setSaveError(null);
    setRoutes((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const addRoute = () => {
    setSaveError(null);
    setRoutes((prev) => [...prev, { url: "", port: 0 }]);
    setIsDirty(true);
  };

  const saveRoutes = async () => {
    const invalidRoutes = routes.filter((r) => r.port < 1 || r.port > 65535);
    if (invalidRoutes.length > 0) {
      setSaveError("포트 번호는 1-65535 범위여야 합니다.");
      return;
    }

    setSaveError(null);

    if (!applicationId || !configuration) {
      const errorMsg =
        "애플리케이션 정보가 없습니다. 페이지를 새로고침 해주세요.";
      console.error("[RoutesContents] applicationId or configuration missing");
      setSaveError(errorMsg);
      return;
    }

    try {
      // routes를 endpoints 형식으로 변환
      const endpointsMap = new Map<number, string[]>();
      routes.forEach((route) => {
        const existing = endpointsMap.get(route.port) || [];
        existing.push(route.url);
        endpointsMap.set(route.port, existing);
      });

      const newEndpoints: ApplicationEndpointDetail[] = Array.from(
        endpointsMap.entries()
      ).map(([port, routesList]) => ({
        port,
        routes: routesList,
      }));

      const updatedConfig: ApplicationConfigurationDetail = {
        ...configuration,
        endpoints: newEndpoints,
      };

      const success = await onUpdate(applicationId, {
        configuration: updatedConfig,
      });

      if (success) {
        console.log("[RoutesContents] Routes 설정 저장 성공");
        setIsDirty(false);
        setSaveError(null);
        onSave();
      } else {
        console.error("[RoutesContents] Routes 설정 저장 실패 (false 반환)");
        setSaveError("저장에 실패했습니다: 업데이트가 완료되지 않았습니다.");
      }
    } catch (err) {
      console.error("[RoutesContents] Routes 설정 저장 실패", err);
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류";
      setSaveError(`저장에 실패했습니다: ${errorMessage}`);
    }
  };

  return (
    <Container>
      {saveError && <ErrorMessage message={saveError} />}
      <ValueBox>
        <Typography size="6x" weight="bold">
          Routes
        </Typography>
        {routes.map((item, i) => (
          <InputArea key={i}>
            <Input_basic
              value={item.url}
              onChange={(e) => handleKeyChange(i, e.target.value)}
              placeholder="URL"
              width="900px"
              height="35px"
              disabled={!editable}
              align="left"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3rem",
              }}
            >
              <Input_basic
                value={item.port}
                onChange={(e) => handleValueChange(i, e.target.value)}
                placeholder="Port"
                type="number"
                width="100px"
                height="35px"
                disabled={!editable}
                align="right"
              />

              {editable && (
                <DeleteBtn onClick={() => removeRoute(i)}>삭제</DeleteBtn>
              )}
            </div>
          </InputArea>
        ))}
      </ValueBox>

      {editable && <AddBtn onClick={addRoute}>+ ROUTE 추가하기</AddBtn>}

      {editable && isDirty && (
        <SaveBox>
          <SaveBtn onClick={saveRoutes}>저장</SaveBtn>
        </SaveBox>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: default;
`;

const ValueBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2rem;
  cursor: default;
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
  cursor: default;
`;

const AddBtn = styled.button`
  background: none;
  border: none;
  color: ${Xquare_colors.gray[600]};
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  &:hover {
    color: ${Xquare_colors.gray[800]};
  }
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    opacity: 0.6;
  }
`;

const SaveBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const SaveBtn = styled.button`
  padding: 8px 14px;
  background-color: ${Xquare_colors.gray[400]};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${Xquare_colors.gray[500]};
  }
`;
