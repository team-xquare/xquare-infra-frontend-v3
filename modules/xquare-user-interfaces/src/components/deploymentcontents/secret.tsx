import { useEffect, useState, startTransition } from "react";
import styled from "@emotion/styled";
import { Input_basic } from "../input";
import { Typography } from "../typography/index";
import { Xquare_colors } from "../../styles/colors";
import { useEnvironmentVariables } from "@xquare/hooks";
import { ErrorMessage } from "../errormessage";
import { LoadingOverlay } from "../loadingoverlays";

interface SecretItem {
  id: string;
  key: string;
  value: string;
}

export default function SecretContents({
  id,
  editable,
  onSave,
}: {
  id: number;
  editable: boolean;
  onSave: () => void;
}) {
  const { variables, loading, error, addOrUpdate, remove } =
    useEnvironmentVariables(id);

  const [secrets, setSecrets] = useState<SecretItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const items = variables.map((v) => ({
      id: crypto.randomUUID(),
      key: v.name,
      value: v.value,
    }));
    startTransition(() => {
      setSecrets(items);
      setIsDirty(false);
    });
  }, [variables]);

  const handleKeyChange = (index: number, v: string) => {
    setSecrets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, key: v } : s))
    );
    setIsDirty(true);
  };

  const handleValueChange = (index: number, v: string) => {
    setSecrets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, value: v } : s))
    );
    setIsDirty(true);
  };

  const removeSecret = async (index: number) => {
    const secret = secrets[index];
    if (!secret.key.trim()) {
      setSecrets((prev) => prev.filter((_, i) => i !== index));
      setIsDirty(true);
      return;
    }

    const success = await remove(secret.key);
    if (success) {
      // console.log("[SecretContents] 환경변수 삭제 성공");
      setSaveError(null);
    } else {
      console.error("[SecretContents] 환경변수 삭제 실패");
      setSaveError(error || "삭제에 실패했습니다");
    }
  };

  const addSecret = () => {
    setSecrets((prev) => [
      ...prev,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);
    setIsDirty(true);
  };

  const saveSecrets = async () => {
    // console.log("[SecretContents] 전송될 데이터:", secrets);
    setSaveError(null);

    for (const secret of secrets) {
      if (!secret.key.trim()) {
        setSaveError("환경변수 이름을 입력해주세요");
        return;
      }

      const success = await addOrUpdate(secret.key, secret.value);
      if (!success) {
        setSaveError(error || `${secret.key} 저장에 실패했습니다`);
        return;
      }
    }

    // console.log("[SecretContents] 모든 환경변수 저장 성공");
    setIsDirty(false);
    setSaveError(null);
    onSave();
  };

  return (
    <Container>
      <LoadingOverlay isLoading={loading} />
      {error && <ErrorMessage message={error} />}
      {saveError && <ErrorMessage message={saveError} />}
      <ValueBox>
        <Typography size="6x" weight="bold">
          Secret
        </Typography>
        {secrets.map((item, i) => (
          <InputArea key={item.id}>
            <Input_basic
              value={item.key}
              onChange={(e) => handleKeyChange(i, e.target.value)}
              placeholder="Key"
              width="580px"
              height="35px"
              disabled={!editable}
              align="left"
            />
            <Input_basic
              value={item.value}
              onChange={(e) => handleValueChange(i, e.target.value)}
              placeholder="Value"
              type="text"
              width="580px"
              height="35px"
              disabled={!editable}
              align="right"
            />

            {editable && (
              <DeleteBtn onClick={() => removeSecret(i)}>삭제</DeleteBtn>
            )}
          </InputArea>
        ))}
      </ValueBox>

      {editable && <AddBtn onClick={addSecret}>+ SECRET 추가하기</AddBtn>}

      {editable && isDirty && (
        <SaveBox>
          <SaveBtn onClick={saveSecrets}>저장</SaveBtn>
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

const AddBtn = styled.button`
  background: none;
  border: none;
  color: ${Xquare_colors.gray[500]};
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 1rem;

  &:hover {
    color: ${Xquare_colors.gray[400]};
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
