import styled from "@emotion/styled";
import { Xquare_colors } from "../../../styles/colors";

interface SummaryItemProps {
  SummaryValue: string;
}

function SummaryItem({ SummaryValue }: SummaryItemProps) {
  return <Item>{SummaryValue}</Item>;
}

const Item = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 38px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid ${Xquare_colors.gray[300]};

  font-size: 15px;
  font-weight: 500;
  color: ${Xquare_colors.black};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export { SummaryItem };
