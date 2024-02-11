import { render } from "preact"
import { useState } from "preact/hooks"
import { HexAlphaColorPicker } from "react-colorful"
import { useClear } from "./draw-tools/useClear"
import { useColor } from "./draw-tools/useColor"
import { useDrawler } from "./draw-tools/useDrawler"
import { useLiner } from "./draw-tools/useLiner"
import "./styles/output.css"

export function App() {
  const [mouseDown, setMouseDown] = useState(false)
  const [color, setColor] = useState("#aabbcc")
  const [colorModal, setColorModal] = useState(false)

  const { canvasRef, draw } = useDrawler()

  const { select, isActive, toggleActivation, isSmoothMode, toggleSmoothMode } =
    useLiner(draw)
  const { clear } = useClear(draw)
  const { pallete, addNewColor, changeColor } = useColor(draw)

  const pageWidth = 1000
  const pageHeight = 400

  return (
    <div class={`mx-auto mt-[25px]`} style={{ width: pageWidth }}>
      <canvas
        style={{ "image-rendering": "pixelated" }}
        onClick={(event) => {
          const rect = canvasRef.current.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top

          draw(({ context }) => context.drawPixel(x, y))

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
            draw(({ context }) => context.drawPixel(x, y))
          }
        }}
        class={`mx-auto bg-white shadow shadow-indigo-100`}
        ref={canvasRef}
        width={pageWidth}
        height={pageHeight}
      ></canvas>
      <div class={`flex mx-auto gap-[3px] mt-[3px]`}>
        <button class="btn" onClick={() => draw(clear)}>
          clear
        </button>
        <button
          class={`btn ${isActive ? "btn-active" : ""}`}
          onClick={toggleActivation}
        >
          line
        </button>
        <button
          class={`btn ${isSmoothMode ? "btn-active" : ""}`}
          onClick={toggleSmoothMode}
        >
          ~
        </button>

        <div class="flex relative panel items-center px-2 gap-2">
          {pallete.map((c) => (
            <button
              key={c.color}
              onClick={c.selectThisColor}
              style={{ backgroundColor: c.color }}
              class={`h-4 w-4 ${
                c.isSelected ? "border-[1.5px]" : ""
              } border border-indigo-400 hover:border-[1.5px] transition-all duration-100 ease-in`}
            ></button>
          ))}
          <button
            onClick={() => {
              setColorModal((prev) => {
                if (prev) {
                  addNewColor(color)
                  changeColor(color)
                }
                return !prev
              })
            }}
            class="h-4 w-4 flex justify-center items-center btn border border-indigo-400"
          >
            +
          </button>
          <div
            class={`bottom-10 ${colorModal ? "visible" : "invisible"} absolute`}
          >
            <HexAlphaColorPicker color={color} onChange={setColor} />
          </div>
        </div>

        <input
          class="panel w-60 "
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = (event.target as HTMLInputElement).files[0]
            const reader = new FileReader()

            reader.onload = function (event) {
              const img = new Image()
              img.onload = function () {
                draw(({ context, canvas }) => {
                  context.imageSmoothingEnabled = false

                  var percent = 0.5

                  // Calculate the scaled dimensions.
                  const width = img.clientWidth
                  const height = img.clientHeight

                  var scaledWidth = 50
                  var scaledHeight = 50

                  // context.drawImage(img, 0, 0)
                  console.log(scaledWidth, scaledHeight)
                  context.drawImage(img, 0, 0, scaledWidth, scaledHeight)
                  context.drawImage(
                    canvas,
                    0,
                    0,
                    scaledWidth,
                    scaledHeight,
                    0,
                    0,
                    500,
                    500
                  )
                })
              }
              img.src = event.target.result as string
            }

            reader.readAsDataURL(file)
          }}
        />
      </div>
    </div>
  )
}

render(<App />, document.getElementById("app"))
