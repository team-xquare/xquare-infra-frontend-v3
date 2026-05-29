import styled from "@emotion/styled";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
} from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAddonDetail,
  useAuthGuard,
  useUpdateAddon,
  useDeleteAddon,
} from "@xquare/hooks";
import {
  Title,
  LoadingOverlay,
  ErrorMessage,
  Button_round,
  Typography,
  Input_basic,
  Xquare_colors,
} from "@xquare/user-interfaces";

const noop: ChangeEventHandler<HTMLInputElement> = () => undefined;

function AddonDetailPage() {
  useAuthGuard();
  const { addonId: addonIdParam } = useParams<{ addonId: string }>();
  const navigate = useNavigate();

  const addonId = useMemo(() => {
    if (!addonIdParam) {
      return undefined;
    }
    const parsed = Number(addonIdParam);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [addonIdParam]);

  const { data, loading, error, refetch } = useAddonDetail(addonId);
  const { mutate: updateAddon, loading: updateLoading } = useUpdateAddon();
  const { mutate: deleteAddon, loading: deleteLoading } = useDeleteAddon();

  const [storageInput, setStorageInput] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "XQUARE | Addon Detail";
  }, []);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageInput(String(data.storageGi));
    }
  }, [data]);

  const configurationEntries = useMemo(() => {
    if (!data) {
      return [] as Array<[string, unknown]>;
    }
    return Object.entries(data.configuration ?? {});
  }, [data]);

  const formatConfigValue = useCallback((value: unknown) => {
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (err) {
        console.error("[AddonDetailPage] configuration stringify failed", err);
        return String(value);
      }
    }
    return String(value);
  }, []);

  const handleSave = useCallback(async () => {
    if (!data || !addonId || updateLoading) {
      return;
    }

    const trimmed = storageInput.trim();
    if (!trimmed) {
      setSubmitError("스토리지 용량을 입력해주세요.");
      setSuccessMessage(null);
      return;
    }

    const nextStorage = Number(trimmed);
    if (!Number.isFinite(nextStorage) || nextStorage < 0) {
      setSubmitError("0 이상의 숫자를 입력해주세요.");
      setSuccessMessage(null);
      return;
    }

    setSubmitError(null);

    try {
      await updateAddon(addonId, { storageGi: nextStorage });
      await refetch();
      setSuccessMessage("애드온이 수정되었습니다.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "애드온 수정에 실패했습니다.";
      setSubmitError(message);
      setSuccessMessage(null);
    }
  }, [addonId, data, refetch, storageInput, updateAddon, updateLoading]);

  const handleDelete = useCallback(async () => {
    if (!addonId || deleteLoading || !data) {
      return;
    }

    const confirmed = window.confirm(
      `정말 ${data.name} 애드온을 삭제하시겠습니까?`,
    );

    if (!confirmed) return;

    try {
      await deleteAddon(addonId);
      alert(`${data.name} 애드온이 삭제되었습니다.`);
      navigate("/addons");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "애드온 삭제에 실패했습니다.";
      alert(message);
    }
  }, [deleteAddon, addonId, navigate, data, deleteLoading]);

  const configurationContent = (
    <>
      <ValueBox>
        <Typography size="6x" weight="bold">
          Addon
        </Typography>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Addon ID
          </Typography>
          <Input_basic
            value={data ? `#${data.id}` : ""}
            onChange={noop}
            placeholder="Addon ID"
            width="950px"
            height="35px"
            disabled
          />
        </InputArea>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Addon Name
          </Typography>
          <Input_basic
            value={data?.name ?? ""}
            onChange={noop}
            placeholder="Addon Name"
            width="950px"
            height="35px"
            disabled
          />
        </InputArea>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Addon Type
          </Typography>
          <Input_basic
            value={data?.type ?? ""}
            onChange={noop}
            placeholder="Addon Type"
            width="950px"
            height="35px"
            disabled
          />
        </InputArea>
      </ValueBox>

      <ValueBox>
        <Typography size="6x" weight="bold">
          Storage Settings
        </Typography>
        <InputArea>
          <Typography size="5x" weight="semiBold">
            Storage (Gi)
          </Typography>
          <StorageInputGroup>
            <Input_basic
              value={storageInput}
              onChange={(event) => setStorageInput(event.target.value)}
              placeholder="Storage Capacity"
              type="number"
              width="220px"
              align="right"
              height="20px"
              min={0}
              disabled={!data}
            />
            <UnitTag>Gi</UnitTag>
          </StorageInputGroup>
        </InputArea>
        <ActionRow>
          <Button_round
            width="160px"
            onClick={handleDelete}
            disabled={deleteLoading || !data || updateLoading}
            variant="danger"
          >
            {deleteLoading ? "삭제 중" : "삭제하기"}
          </Button_round>
          <Button_round
            width="160px"
            onClick={handleSave}
            disabled={updateLoading || !data}
          >
            {updateLoading ? "저장 중" : "저장하기"}
          </Button_round>
        </ActionRow>
      </ValueBox>

      <ValueBox>
        <Typography size="6x" weight="bold">
          Additional Settings
        </Typography>
        {configurationEntries.length === 0 ? (
          <EmptyState>구성 정보가 없습니다.</EmptyState>
        ) : (
          <ConfigList>
            {configurationEntries.map(([key, value]) => (
              <InputArea key={key}>
                <Typography size="5x" weight="semiBold">
                  {key}
                </Typography>
                <Input_basic
                  value={formatConfigValue(value)}
                  onChange={noop}
                  placeholder={key}
                  width="950px"
                  height="35px"
                  disabled
                />
              </InputArea>
            ))}
          </ConfigList>
        )}
      </ValueBox>
    </>
  );

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Addon Detail</title>
      </Helmet>
      <LoadingOverlay isLoading={loading || updateLoading || deleteLoading} />
      <ContentsArea>
        <Title
          title={"Addon Detail"}
          subTitle="애드온 상세 정보를 확인합니다."
        />
      </ContentsArea>
      <FeedbackArea>
        {error && (
          <ErrorMessage message={`애드온 조회 실패: ${error.message}`} />
        )}
        {submitError && (
          <ErrorMessage message={`애드온 수정 실패: ${submitError}`} />
        )}
        {successMessage && <SuccessBanner>{successMessage}</SuccessBanner>}
      </FeedbackArea>
      <Contents>{configurationContent}</Contents>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 12px 40px;
  padding-top: 22px;
  cursor: default;
`;

const ContentsArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  cursor: default;
`;

const FeedbackArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 18px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 32px;
  margin-top: 20px;
`;

const ValueBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 3px 5px;
  width: 100%;
  height: 40px;
  border-bottom: 2px solid ${String(Xquare_colors.gray[300])};
`;

const StorageInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UnitTag = styled.span`
  font-size: 16px;
  color: ${String(Xquare_colors.gray[500])};
`;

const ActionRow = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
  gap: 12px;
`;

const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const EmptyState = styled.div`
  padding: 20px;
  border-radius: 12px;
  background-color: ${String(Xquare_colors.gray[300])};
  color: ${String(Xquare_colors.gray[500])};
  text-align: center;
`;

const SuccessBanner = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${String(Xquare_colors.purple[100])};
  color: ${String(Xquare_colors.purple[600])};
`;

export default AddonDetailPage;
