import { useState } from "preact/hooks";
import { UltimateContexter } from "./contexter";
import { pixelize, pxl } from "./utils";
import { cloneElement } from "preact";

type Point = { x: number; y: number };

export const useHermiteCurve = (draw: UltimateContexter) => {
  const [lastPoint, setLastPoint] = useState<Point>(undefined);

  const [startPoint, setStartPoint] = useState<Point>(undefined);
  const [startTangent, setStartTangent] = useState<Point>(undefined);
  const [endTangent, setEndTangent] = useState<Point>(undefined);
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleActivation = () => {
    setLastPoint(undefined);
    setIsActive((prev) => !prev);
  };

  const drawHermiteCurve = (
    startPoint: Point,
    endPoint: Point,
    startTangent: Point,
    endTangent: Point,
  ) => {
    const startX = startPoint.x;
    const startY = startPoint.y;
    const endX = endPoint.x;
    const endY = endPoint.y;
    const startTanX = startTangent.x;
    const startTanY = startTangent.y;
    const endTanX = endTangent.x;
    const endTanY = endTangent.y;

    let t = 0.0;
    const step = 0.01;

    while (t <= 1.0) {
      const x = calculateHermiteValue(startX, startTanX, endX, endTanX, t);
      const y = calculateHermiteValue(startY, startTanY, endY, endTanY, t);

      draw(({ context }) => {
        context.drawPixel(Math.round(x), Math.round(y));
      });
      t += step;
    }
  };

  const calculateHermiteValue = (
    p0: number,
    t0: number,
    p1: number,
    t1: number,
    t: number,
  ) => {
    const t2 = t * t;
    const t3 = t2 * t;
    const h1 = 2 * t3 - 3 * t2 + 1;
    const h2 = -2 * t3 + 3 * t2;
    const h3 = t3 - 2 * t2 + t;
    const h4 = t3 - t2;

    return h1 * p0 + h2 * p1 + h3 * t0 + h4 * t1;
  };

  const select = (point: Point) => {
    if (!endTangent && startTangent && startPoint) setEndTangent(point);
    if (!startTangent && startPoint) setStartTangent(point);
    if (!startPoint) setStartPoint(point);

    if (startPoint && endTangent && startTangent && point) { 

      drawHermiteCurve(startPoint, point, startTangent, endTangent)

      setStartPoint(undefined);
      setEndTangent(undefined);
      setStartTangent(undefined);
    }
  };

  return {
    select,
    isActive,
    toggleActivation,
  };
};
