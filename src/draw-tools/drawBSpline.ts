import { useState } from "preact/hooks";
import { UltimateContexter } from "./contexter";
import { pixelize, pxl } from "./utils";
import { cloneElement } from "preact";

type Point = { x: number; y: number };

export const useBSpline = (draw: UltimateContexter) => {
  const [lastPoint, setLastPoint] = useState<Point>(undefined);

  const [point1, setPoint1] = useState<Point>(undefined);
  const [point2, setPoint2] = useState<Point>(undefined);
  const [point3, setPoint3] = useState<Point>(undefined);
  const [point4, setPoint4] = useState<Point>(undefined);
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleActivation = () => {
    setLastPoint(undefined);
    setIsActive((prev) => !prev);
  };

   const drawBSpline = (controlPoints: Point[]) => {
    const n = controlPoints.length - 1;
    const step = 0.01;

    for (let t = 2; t <= n; t += step) {
        let x = 0.0;
        let y = 0.0;

        for (let i = 0; i <= n; i++) {
            const basis = bSplineBasis(i, 3, t);
            x += basis * controlPoints[i].x;
            y += basis * controlPoints[i].y;
        }

        draw(({context}) => context.drawPixel(Math.round(x), Math.round(y)))
    }
};

const bSplineBasis = (i: number, k: number, t: number): number => {
    if (k === 1) {
        if (i <= t && t < i + 1)
            return 1;
        return 0;
    }
    const denominator1 = i + k - 1 - i;
    const denominator2 = i + k - 1 - (i + k - 1 - 1);
    let basis1 = 0, basis2 = 0;
    if (denominator1 !== 0)
        basis1 = ((t - i) / denominator1) * bSplineBasis(i, k - 1, t);
    if (denominator2 !== 0)
        basis2 = ((i + k - t) / denominator2) * bSplineBasis(i + 1, k - 1, t);
    return basis1 + basis2;
};

  const select = (point: Point) => {
    if (!point4 && point3 && point2 && point1) setPoint4(point);
    if (!point3 && point2 && point1) setPoint3(point);
    if (!point2 && point1) setPoint2(point);
    if (!point1) setPoint1(point);

    if (point1 && point3 && point4 && point2 && point) { 

      drawBSpline([point1, point2, point3, point4, point])

      setPoint1(undefined);
      setPoint3(undefined);
      setPoint2(undefined);
      setPoint4(undefined);
    }
  };

  return {
    select,
    isActive,
    toggleActivation,
  };
};
