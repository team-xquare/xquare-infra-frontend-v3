import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Typography, Xquare_colors } from "@xquare/user-interfaces";
import { useAuthGuard } from "@xquare/hooks";
import { useEffect } from "react";

const FeedView = () => {
  useAuthGuard();

  useEffect(() => {
    document.title = "XQUARE | Feed Detail";
  }, []);

  const title = "피드 제목";
  const date = "2024-06-10";
  const content = `피드 내용이 여기에 표시됩니다. 피드 내용이 여기에 표시됩니다. 피드 내용이 여기에 표시됩니다.`;

  const files = [
    { name: "피드_첨부파일.pdf", url: "/files/피드_첨부파일.pdf" },
    { name: "피드_첨부파일2.pdf", url: "/files/피드_첨부파일2.pdf" },
  ];

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Feed Detail</title>
      </Helmet>
      <ContentsArea>
        <Typography size="8x" weight="semiBold">
          {title}
        </Typography>
        <Typography size="4x" weight="regular">
          {date}
        </Typography>
      </ContentsArea>

      <Content>{content}</Content>

      <FileArea>
        {files.length === 0 ? (
          <NoFileText>첨부된 파일이 없습니다.</NoFileText>
        ) : (
          files.map((file) => (
            <File key={file.name}>
              <Typography size="4x" weight="semiBold">
                첨부파일
              </Typography>
              <Typography size="4x" weight="semiBold">
                |
              </Typography>
              <Typography size="4x" weight="regular">
                <FileLink href={file.url} download={file.name}>
                  {file.name}
                </FileLink>
              </Typography>
            </File>
          ))
        )}
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
  padding: 20px 40px;
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
  height: 480px;
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

const File = styled.div`
  flex-direction: row;
  display: flex;
  gap: 10px;
`;

const NoFileText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${Xquare_colors.gray[500]};
`;

const FileLink = styled.a`
  text-decoration: underline;
  color: ${Xquare_colors.black};
  font-weight: 500;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
`;

export default FeedView;
