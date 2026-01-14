import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import {
  Typography,
  Xquare_colors,
  ErrorMessage,
  LoadingOverlay,
} from "@xquare/user-interfaces";
import { useAuthGuard, useNoticeDetail } from "@xquare/hooks";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const NoticeView = () => {
  useAuthGuard();
  const { id } = useParams();
  const noticeId = Number(id);

  useEffect(() => {
    document.title = "XQUARE | Notice Detail";
  }, []);
  const { data, loading, error } = useNoticeDetail(
    Number.isNaN(noticeId) ? undefined : noticeId
  );

  const title = data?.title ?? "공지사항";
  const date = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString()
    : "";
  const content = data?.content ?? "";

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Notice Detail</title>
      </Helmet>
      <LoadingOverlay isLoading={loading} />
      <ContentsArea>
        <Typography size="8x" weight="semiBold">
          {loading ? "loading..." : title}
        </Typography>
        {!loading && (
          <Typography size="4x" weight="regular">
            {date}
          </Typography>
        )}
      </ContentsArea>

      {error ? (
        <ErrorMessage message={`공지 상세 조회 실패: ${error.message}`} />
      ) : !loading && content ? (
        <Content>{content}</Content>
      ) : null}

      <FileArea>
        <NoFileText>첨부된 파일이 없습니다.</NoFileText>
      </FileArea>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 12px 40px;
  padding-top: 22px;
  padding-bottom: 40px;
  cursor: default;
`;

const ContentsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
  width: 100%;
  margin-bottom: 15px;
`;

const Content = styled.div`
  font-family: "Pretendard";
  width: 100%;
  font-size: 17px;
  text-align: justify;
  line-height: 1.5;
  height: 100%;
  padding: 3px 3px;
`;

const FileArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 10px;
  gap: 12px;
  border-top: 2px solid ${Xquare_colors.gray[300]};
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
`;

// const File = styled.div`
//   flex-direction: row;
//   display: flex;
//   gap: 10px;
// `;

const NoFileText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${Xquare_colors.gray[500]};
`;

// const FileLink = styled.a`
//   text-decoration: underline;
//   color: ${Xquare_colors.black};
//   font-weight: 500;
//   cursor: pointer;
//   &:hover {
//     opacity: 0.7;
//   }
// `;

export default NoticeView;
