import styled from "@emotion/styled";
import { Xquare_colors } from "@xquare/user-interfaces";

interface UsageChartProps {
  title: string;
  current: number;
  points: number[];
  timeLabels: string[];
}

const VIEW_WIDTH = 400;
const PLOT_HEIGHT = 98;

function UsageChart({ title, current, points, timeLabels }: UsageChartProps) {
  const step = points.length > 1 ? VIEW_WIDTH / (points.length - 1) : 0;
  const polyline = points
    .map((value, i) => {
      const x = i * step;
      const y =
        PLOT_HEIGHT - (Math.min(Math.max(value, 0), 100) / 100) * PLOT_HEIGHT;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <Card>
      <Header>
        <Title>{title}</Title>
        <Current>{current}%</Current>
      </Header>
      <Plot>
        <Scale>
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </Scale>
        <Graph>
          <Gridline />
          <Gridline />
          <Gridline />
          <Svg
            viewBox={`0 0 ${VIEW_WIDTH} ${PLOT_HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${title} 추이`}
          >
            <polyline
              points={polyline}
              fill="none"
              stroke={Xquare_colors.purple[500] as string}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </Svg>
        </Graph>
      </Plot>
      <TimeScale>
        {timeLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </TimeScale>
    </Card>
  );
}

const Card = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border: 1px solid ${Xquare_colors.gray[300] as string};
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1.2;
  color: ${Xquare_colors.black as string};
`;

const Title = styled.p`
  font-weight: 700;
`;

const Current = styled.p`
  font-weight: 500;
`;

const Plot = styled.div`
  display: flex;
  gap: 12px;
`;

const Scale = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 35px;
  height: ${PLOT_HEIGHT}px;
  flex-shrink: 0;
  font-size: 12px;
  line-height: 1.2;
  color: ${Xquare_colors.gray[500] as string};
`;

const Graph = styled.div`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
  height: ${PLOT_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Gridline = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${Xquare_colors.gray[300] as string};
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const TimeScale = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 47px;
  font-size: 12px;
  line-height: 1.2;
  color: ${Xquare_colors.gray[500] as string};
`;

export default UsageChart;
