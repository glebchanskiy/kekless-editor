import { render } from "preact"
import { useState } from "preact/hooks"
import { Printer } from "./draw-tools/contexter"
import { useClear } from "./draw-tools/useClear"
import { useColor } from "./draw-tools/useColor"
import { useDrawler } from "./draw-tools/useDrawler"
import { useLiner } from "./draw-tools/useLiner"
import { pxl } from "./draw-tools/utils"
import "./styles/output.css"

export function App() {
  const [mouseDown, setMouseDown] = useState(false)

  const { canvasRef, draw } = useDrawler()

  const { select, isActive, toggleActivation } = useLiner(draw)
  const { clear } = useClear(draw)
  const { pallete } = useColor(draw)

  const rects: Printer = ({ context }) => {
    context.fillStyle = "rgb(200 0 0)"
    context.fillRect(10, 10, 50, 50)

    context.fillStyle = "rgb(0 0 200 / 50%)"
    context.fillRect(30, 30, 50, 50)
  }

  return (
    <div>
      <div class="w-[700px] flex flex-col mt-4 mx-auto">
        <canvas
          onClick={(event) => {
            const rect = canvasRef.current.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            const n = pxl(x, y)

            draw(({ context }) => context.fillRect(n.x, n.y, n.w, n.h))

            if (isActive) {
              select({ x, y })
            }
          }}
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseMove={(event) => {
            if (mouseDown) {
              const rect = canvasRef.current.getBoundingClientRect()
              const x = event.clientX - rect.left
              const y = event.clientY - rect.top
              const n = pxl(x, y)
              draw(({ context }) => context.fillRect(n.x, n.y, n.w, n.h))
              console.log("rect:", rect)
            }
          }}
          class="bg-white shadow shadow-indigo-100"
          ref={canvasRef}
          id="tutorial"
          width={700}
          height={300}
        ></canvas>
        <div class="flex gap-[3px] mt-[3px]">
          <button class="btn" onClick={() => draw(clear)}>
            clear
          </button>
          <button class="btn" onClick={() => draw(rects)}>
            testbtn
          </button>
          <button
            class={`btn ${isActive ? "btn-active" : ""}`}
            onClick={() => toggleActivation()}
          >
            line
          </button>

          <div class=" flex panel items-center px-2 gap-2">
            {pallete.map((c) => (
              <button
                key={c.color}
                onClick={c.selectThisColor}
                class={`h-4 w-4 bg-[${c.color}] ${
                  c.isSelected ? "border-[1.5px]" : ""
                } border border-indigo-400 hover:border-[1.5px] transition-all duration-100 ease-in`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

render(<App />, document.getElementById("app"))
