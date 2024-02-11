export const pixelize = (
 x: number,
 y: number,
 size: number = 5
): { x: number; y: number; w: number; h: number } => {
 var alignedX = Math.floor(x / size) * size
 var alignedY = Math.floor(y / size) * size
 return {
  x: alignedX,
  y: alignedY,
  h: size,
  w: size,
 }
}