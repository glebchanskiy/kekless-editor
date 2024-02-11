import { useState } from "preact/hooks"
import { UltimateContexter } from "./contexter"
import { pxl } from "./utils"

type Point = { x: number, y: number }

export const useLiner = (draw: UltimateContexter) => {
 const [selectedPoints, setSelectedPoints] = useState<Point[]>([])
 const [isActive, setIsActive] = useState<boolean>(false)

 const toggleActivation = () => {
  setSelectedPoints([])
  setIsActive(prev => !prev)
 }

 const drawLine = (p1: Point, p2: Point) => {
  const x1 = p1.x
  const y1 = p1.y
  const x2 = p2.x
  const y2 = p2.y

  const length = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))

  const dx = (x2 - x1) / length
  const dy = (y2 - y1) / length

  let x = x1 + 0.5 * Math.sign(dx)
  let y = y1 + 0.5 * Math.sign(dy)

  const n = pxl(x, y)
  draw(({ context }) => context.fillRect(n.x, n.y, n.w, n.h))

  let i = 0
  while (i < length) {
   x = x + dx
   y = y + dy
   const l = pxl(x, y)
   draw(({ context }) => context.fillRect(l.x, l.y, l.w, l.h))
   i++
  }
 }

 const select = (point: Point) => {
  if (selectedPoints.length > 0) {
   const lastPoint = selectedPoints[selectedPoints.length - 1]
   drawLine(point, lastPoint)
  }
  setSelectedPoints(prev => prev.findIndex(p => point.x === p.x && point.y === p.y) === -1 ? [...prev, point] : prev)
 }


 return {
  select,
  isActive,
  toggleActivation
 }
}