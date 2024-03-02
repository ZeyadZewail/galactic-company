// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ConnectionLineComponentProps} from "@reactflow/core/dist/esm/types/edges";

export const BaseConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) => {
  return (
    <g>
      <path
        fill="none"
        stroke={"white"}
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={"white"}
        strokeWidth={1.5}
      />
    </g>
  );
};
