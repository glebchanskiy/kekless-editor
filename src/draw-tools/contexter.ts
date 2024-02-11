import { pixelize } from "./utils"

type DralwerProps = {
 canvas: HTMLCanvasElement, context: CanvasRenderingContext2D
}
export type Printer = (props: DralwerProps) => void
export type AmazingPrinter = (...args: any[]) => Printer
export type UltimateContexter = (printer: Printer) => void
export type UltimateContexterProducer = (props: DralwerProps) => UltimateContexter

export const ContexterProducer: UltimateContexterProducer = (props: DralwerProps) => (printer: Printer) => {
 // props.context.beginPath()
 printer({ canvas: props.canvas, context: props.context })
 // props.context.closePath()
}

CanvasRenderingContext2D.prototype.drawPixel = function (x: number, y: number) {
 const { x: _x, y: _y, w, h } = pixelize(x, y, 10)
 this.fillRect(_x, _y, w, h)
}