type DralwerProps = {
 canvas: HTMLCanvasElement, context: CanvasRenderingContext2D
}
export type Printer = (props: DralwerProps) => void
export type AmazingPrinter = (...args: any[]) => Printer
export type UltimateContexter = (printer: Printer) => void
export type UltimateContexterProducer = (props: DralwerProps) => UltimateContexter

export const ContexterProducer: UltimateContexterProducer = (props: DralwerProps) => (printer: Printer) => {
 // props.context.beginPath()
 props.context.strokeStyle = 'red'
 printer({ canvas: props.canvas, context: props.context })
 // props.context.closePath()
 props.context.stroke()
} 