import styled from "@emotion/styled";
import { NoticeItem } from "./noticeitem/index";
import { Subtitle } from "../title/index";

function Notice() {
  const items = [
    {
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
    {
      NoticeValue: "XQUARE INFRASTRUCTURE를 이용하여 50일간 서비스 되었습니다.",
      date: "2024.06.01",
    },
  ];

  return (
    <Summarycontainer>
      <Subtitle
        title={`System Notice`}
        subTitle={"xquare infrastructure 의 주요 수정사항 및, 공지사항"}
      ></Subtitle>
      <div>
        {items.map((item) => (
          <NoticeItem NoticeValue={item.NoticeValue} date={item.date} />
        ))}
      </div>
    </Summarycontainer>
  );
}

const Summarycontainer = styled.div`
  display: flex;
  width: 55%;
  flex-direction: column;
  gap: 10px;
`;

export { Notice };
