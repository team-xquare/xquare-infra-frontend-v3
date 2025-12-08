import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

interface NoticeItemProps {
  NoticeValue: string;
  date: string;
}

function NoticeItem({ NoticeValue, date }: NoticeItemProps) {
  return (
    <Container>
      <Item>{NoticeValue}</Item>
      <Date>{date}</Date>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 38px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};
`;

const Item = styled.div`
  display: flex;
  width: 90%;

  font-size: 15px;
  font-weight: 500;
  color: ${Xquare_colors.purple[500]};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Date = styled.div`
  display: flex;
  width: 10%;
  font-size: 13px;
  font-weight: 400;
  color: ${Xquare_colors.gray[500]};
`;

export { NoticeItem };
