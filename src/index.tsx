import { render } from "preact"
import { useState } from "preact/hooks"
import { Printer } from "./draw-tools/contexter"
import { useDrawler } from "./draw-tools/useDrawler"
import { useLiner } from "./draw-tools/useLiner"
import { pxl } from "./draw-tools/utils"
import "./styles/output.css"

const colorPalette: { color: string; style: string }[] = [
  { color: "#756AB6", style: "bg-[#756AB6]" },
  { color: "#AC87C5", style: "bg-[#AC87C5]" },
  { color: "#E0AED0", style: "bg-[#E0AED0]" },
  { color: "#FFE5E5", style: "bg-[#FFE5E5]" },
]

export function App() {
  const { canvasRef, draw } = useDrawler()

  const { select, isActive, toggleActivation } = useLiner(draw)

  const [selectedColor, setSelectedColor] = useState<string>(
    colorPalette[0].color
  )

  const [mouseDown, setMouseDown] = useState(false)

  const clear: Printer = ({ context, canvas }) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

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
            {colorPalette.map((c) => (
              <button
                key={c.color}
                onClick={() => {
                  draw(({ context }) => {
                    context.fillStyle = c.color
                  })
                  setSelectedColor(c.color)
                }}
                class={`h-4 w-4 ${c.style} ${
                  c.color === selectedColor ? "border-[1.5px]" : ""
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
