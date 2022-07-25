import React from "react";
import { Box, Center, Icon } from "@chakra-ui/react";

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function rotate(rotation: number, [x, y]: number[]) {
  const rot = deg2rad(rotation);
  const rx = x * Math.cos(rot) - y * Math.sin(rot);
  const ry = x * Math.sin(rot) + y * Math.cos(rot);
  return [rx, ry];
}

function translate(dx: number, dy: number, [x, y]: number[]) {
  return [x + dx, y + dy];
}

function pathStr(coords: number[][]) {
  const m = `M ${coords[0][0]} ${coords[0][1]}`;
  const l = coords
    .slice(1)
    .map(([x, y]) => `L ${x} ${y}`)
    .join(" ");
  return `${m} ${l} Z`;
}

function boundingBox(coords: number[][]) {
  const fst = ([x, _]: number[]) => x;
  const snd = ([_, y]: number[]) => y;

  const xs = coords.map(fst);
  const ys = coords.map(snd);

  const [minX, minY] = [Math.min(...xs), Math.min(...ys)];
  const [maxX, maxY] = [Math.max(...xs), Math.max(...ys)];

  const [x, y] = [minX, minY];
  const [width, height] = [maxX - minX, maxY - minY];

  return {
    x,
    y,
    width,
    height,
  };
}

export default function Hex({ size, rotation, color, borderSize, borderColor }: any) {
  const dx = size / 2;
  const dy = Math.sqrt(3) * dx;

  const getCoords = () => {
    const dh = size / 2;
    const points = [
      [-dh, dy],
      [dh, dy],
      [dh + dx, 0],
      [dh, -dy],
      [-dh, -dy],
      [-(dh + dx), 0],
    ];
    return points;
  };

  // rotate helper
  const rotateH = (coord: number[]) => rotate(rotation, coord);

  let coords = getCoords().map(rotateH);
  const { x: ox, y: oy, width, height } = boundingBox(coords);

  // translate helper
  const translateH = (coord: number[]) => translate(-ox, -oy, coord);
  coords = coords.map(translateH);

  return (
    <Box position="relative">
      <Center>
        <Icon
          viewBox={`0 0 ${width} ${height}`}
          width={`${width}px`}
          height={`${height}px`}
          overflow="visible"
          margin="auto"
        >
          <path
            d={pathStr(coords)}
            stroke={borderColor}
            strokeWidth={borderSize}
            style={{ fill: color }}
          />
        </Icon>
      </Center>
    </Box>
  );
}

Hex.defaultProps = {
  size: 200,
  rotation: 0,
  color: "var(--color-purple)",
  borderColor: "transparent",
  borderSize: 0,
};
