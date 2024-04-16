import { useState } from "preact/hooks";
import { UltimateContexter } from "./contexter";
import { pixelize, pxl } from "./utils";
import { cloneElement } from "preact";

type Point = { x: number; y: number };

export const useBezierCurve = (draw: UltimateContexter) => {
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

   const drawBezierCurve = (controlPoints: Point[]) => {
      const n = controlPoints.length - 1;
      const step = 0.01;
  
      for (let t = 0.0; t <= 1.0; t += step) {
          let x = 0.0;
          let y = 0.0;
  
          for (let i = 0; i <= n; i++) {
              const coefficient = binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
              x += coefficient * controlPoints[i].x;
              y += coefficient * controlPoints[i].y;
          }
  
          draw(({context}) => context.drawPixel(Math.round(x), Math.round(y)))
      }
  };
  
  const binomialCoefficient = (n: number, k: number): number => {
      let res = 1;
      if (k > n - k)
          k = n - k;
      for (let i = 0; i < k; ++i) {
          res *= (n - i);
          res /= (i + 1);
      }
      return res;
  };

  const select = (point: Point) => {
    if (!point4 && point3 && point2 && point1) setPoint4(point);
    if (!point3 && point2 && point1) setPoint3(point);
    if (!point2 && point1) setPoint2(point);
    if (!point1) setPoint1(point);

    if (point1 && point3 && point4 && point2 && point) { 

      drawBezierCurve([point1, point2, point3, point4, point])

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
