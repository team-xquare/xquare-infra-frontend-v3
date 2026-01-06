import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Xquare_colors } from "../../../styles/colors";

interface NoticeItemProps {
  type: "notice" | "feed";
  id: string | number;
  NoticeValue: string;
  date: string;
}

function NoticeItem({ type, id, NoticeValue, date }: NoticeItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}/view/${id}`);
  };

  return (
    <Container>
      <Item onClick={handleClick}>{NoticeValue}</Item>
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
  cursor: default;
`;

const Item = styled.div`
  display: flex;
  width: 90%;
  cursor: pointer;

  font-size: 15px;
  font-weight: 500;
  color: ${Xquare_colors.purple[500]};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
    color: ${Xquare_colors.purple[600]};
  }
`;

const Date = styled.div`
  display: flex;
  width: 10%;
  font-size: 13px;
  font-weight: 400;
  color: ${Xquare_colors.gray[500]};
  cursor: default;
`;

export { NoticeItem };
