import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import Xquare_colors from "../../styles";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal = ({
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  loading = false,
  errorMessage,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [loading, onClose]);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !loading) onClose();
  };

  return createPortal(
    <ModalBackground onClick={handleBackgroundClick}>
      <ModalContent
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Title id="confirm-modal-title">{title}</Title>
        <Description id="confirm-modal-description">{description}</Description>
        {errorMessage && <ErrorText role="alert">{errorMessage}</ErrorText>}
        <ButtonGroup>
          <CancelButton type="button" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </CancelButton>
          <ConfirmButton
            type="button"
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? "처리 중..." : confirmLabel}
          </ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </ModalBackground>,
    document.body,
  );
};

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  width: min(380px, 100%);
  padding: 28px;
  border-radius: 16px;
  background: ${Xquare_colors.white};
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
`;

const Title = styled.h2`
  margin: 0;
  color: ${Xquare_colors.black};
  font-size: 20px;
`;

const Description = styled.p`
  margin: 12px 0 0;
  color: ${Xquare_colors.gray[500]};
  font-size: 15px;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  margin: 12px 0 0;
  color: ${Xquare_colors.red[500]};
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  min-width: 72px;
  padding: 10px 16px;
  border: 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(ModalButton)`
  background: ${Xquare_colors.gray[300]};
  color: ${Xquare_colors.black};
`;

const ConfirmButton = styled(ModalButton)`
  background: ${Xquare_colors.purple[400]};
  color: ${Xquare_colors.white};
`;
